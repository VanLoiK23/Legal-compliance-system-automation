const express = require('express');
const router = express.Router();
// const {register,signin,fetchUser,deleteUserById,updateUserById} = require('../controllers/usersController')
const {upsertRule,getRuleExist,updateRule,deleteRule,insertLog,fetchLog, filter_rule_exist, check_change_and_update, fetchRuleWeekly, fetchLastLogW1, getRuleCheckCompliance,fetchRuleWeeklyForReport,addRulePending,getRulePending,updateRulePending} = require('../controllers/ruleController')
const {auth,authIsAdmin,checkIsValidOrigin} = require('../middlewares/auth')
const { receiveData ,getData, deleteMetadata} = require('../controllers/metadataController');
const {ProcessUploadData} =  require('../controllers/uploadDataController')
const {checkFiles} = require('../controllers/checkFilesController')
const { saveComplianceResult, getAllResults, getResultById, deleteResult, getStats, fetchDataForDashboard, checkDuplicate } = require('../controllers/complianceController');
const { upsertTemplate, fetch_template_follow_template_key} = require('../controllers/templateController');

//apply middleware for all
// router.use([auth]);
const upload = require('../middlewares/upload');
const { upsertConfig, fetch_config,upsertToggle } = require('../controllers/configController');
const { upsertCredentialGmail,fetch_credential_gmail,add_credential_telegram,upsertCredentialTelegram,fetch_credential_telegram,delete_credential_telegram,fetch_credential_telegram_by_key } = require('../controllers/credentialController');
router.get('/', (req,res)=>{
    res.status(200).json({
        mess:'Hello world API'
    })
}); 
const {getDataw2,saveWeeklyW2Data,gettotalData} = require('../controllers/weeklyw2Controller');
//apply middleware for all routes
router.use(checkIsValidOrigin);

//workflow 1
router.post('/rule',upsertRule);
router.get('/rule',getRuleExist);
router.get('/ruleActive',getRuleCheckCompliance);
router.put('/rule',updateRule);
router.post('/rule/check-duplicate',filter_rule_exist);
router.put('/rule/check-change',check_change_and_update);
router.get('/rule/pending',getRulePending);
router.post('/rule/pending',addRulePending);
router.put('/rule/pending',updateRulePending);
router.get('/rule/weekly',fetchRuleWeekly);
router.get('/rule/weekly-for-report',fetchRuleWeeklyForReport);
router.delete('/rule/:rule_id',deleteRule);
router.post('/logging',insertLog);
router.get('/logging',fetchLog);
router.get('/logging/last-w1',fetchLastLogW1);
router.post('/config',upsertConfig);
router.get('/config',fetch_config);
router.post('/toggle',upsertToggle);
router.get('/toggle',fetch_config);
router.post('/credential-gmail',upsertCredentialGmail);
router.get('/credential-gmail',fetch_credential_gmail);
router.post('/telegram-credentials',add_credential_telegram);
router.put('/telegram-credentials/:_id',upsertCredentialTelegram);
router.get('/telegram-credentials',fetch_credential_telegram);
router.delete('/telegram-credentials/:_id',delete_credential_telegram);
router.get('/telegram-credentials/key/:key',fetch_credential_telegram_by_key);
router.get('/email-templates/:template_key',fetch_template_follow_template_key);
router.post('/email-templates',upsertTemplate);
// router.get('/user',fetchUser);
// router.delete('/user/:id',authIsAdmin,deleteUserById);
// router.put('/user',authIsAdmin,updateUserById);

//workflow 2
//get data uploads
router.get('/receive', getData);
router.post('/receive', receiveData);
router.delete('/receive/:id', deleteMetadata);
//process uploadfile metadata from frontend
router.post('/uploadData',upload.single('file'),ProcessUploadData)
//checkfile exist - hashfile api
router.post('/checkFiles', checkFiles);
router.get('/weekly-w2', getDataw2);
router.post('/weekly-w2-save', saveWeeklyW2Data);
router.get('/weekly-w2/getdata', gettotalData);

//workflow 3
router.post('/compliance-results', saveComplianceResult); // Endpoint 1 (Đã làm)
router.get('/compliance-results', getAllResults);         // Endpoint 2 (Mới)
router.get('/compliance-results/:id', getResultById);     // Endpoint 3 (Mới)
router.delete('/compliance-results/:id', deleteResult); // MỚI
router.get('/compliance-stats', getStats); // MỚI
router.get('/compliance-fetch', fetchDataForDashboard);
router.get('/check-duplicate/:hash', checkDuplicate);

module.exports = router;
