const express = require('express');
const router = express.Router();
// const {register,signin,fetchUser,deleteUserById,updateUserById} = require('../controllers/usersController')
const {upsertRule,getRuleExist,updateRule,deleteRule,insertLog,fetchLog, filter_rule_exist, check_change_and_update, fetchRuleWeekly, fetchLastLogW1, getRuleCheckCompliance} = require('../controllers/ruleController')
const {auth,authIsAdmin,checkIsValidOrigin} = require('../middlewares/auth')
const { receiveData ,getData, deleteMetadata} = require('../controllers/metadataController');
const {ProcessUploadData} =  require('../controllers/uploadDataController')
const {checkFiles} = require('../controllers/checkFilesController')
const { saveComplianceResult, getAllResults, getResultById, deleteResult, getStats, fetchDataForDashboard } = require('../controllers/complianceController');
const { upsertTemplate,fetch_template_add_new_rule} = require('../controllers/templateController');

//apply middleware for all
// router.use([auth]);
const upload = require('../middlewares/upload');
const { upsertConfig, fetch_config } = require('../controllers/configController');
const { upsertCredentialGmail,fetch_credential_gmail } = require('../controllers/credentialController');
router.get('/', (req,res)=>{
    res.status(200).json({
        mess:'Hello world API'
    })
}); 

//apply middleware for all routes
router.use(checkIsValidOrigin);

//workflow 1
router.post('/rule',upsertRule);
router.get('/rule',getRuleExist);
router.get('/ruleActive',getRuleCheckCompliance);
router.put('/rule',updateRule);
router.post('/rule/check-duplicate',filter_rule_exist);
router.put('/rule/check-change',check_change_and_update);
router.get('/rule/weekly',fetchRuleWeekly);
router.delete('/rule/:rule_id',deleteRule);
router.post('/logging',insertLog);
router.get('/logging',fetchLog);
router.get('/logging/last-w1',fetchLastLogW1);
router.post('/config',upsertConfig);
router.get('/config',fetch_config);
router.post('/credential-gmail',upsertCredentialGmail);
router.get('/credential-gmail',fetch_credential_gmail);
router.post('/template',upsertTemplate);
router.get('/email-templates/ingestion_new_rule',fetch_template_add_new_rule);
router.get('/email-templates',upsertTemplate);
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

//workflow 3
router.post('/compliance-results', saveComplianceResult); // Endpoint 1 (Đã làm)
router.get('/compliance-results', getAllResults);         // Endpoint 2 (Mới)
router.get('/compliance-results/:id', getResultById);     // Endpoint 3 (Mới)
router.delete('/compliance-results/:id', deleteResult); // MỚI
router.get('/compliance-stats', getStats); // MỚI
router.get('/compliance-fetch', fetchDataForDashboard);
// Route này để n8n gọi tới
router.post('/compliance-results', saveComplianceResult);

module.exports = router;