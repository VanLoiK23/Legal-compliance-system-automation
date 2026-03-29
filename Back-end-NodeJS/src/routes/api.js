const express = require('express');
const router = express.Router();
// const {register,signin,fetchUser,deleteUserById,updateUserById} = require('../controllers/usersController')
const {upsertRule,getRuleExist,updateRule,deleteRule,insertLog,fetchLog, filter_rule_exist, check_change_and_update, fetchRuleWeekly, fetchLastLogW1} = require('../controllers/ruleController')
const {auth,authIsAdmin} = require('../middlewares/auth')
const { receiveData ,getMetadata, deleteMetadata} = require('../controllers/metadataController');
const {ProcessUploadData} =  require('../controllers/uploadDataController')
const {checkFiles} = require('../controllers/checkFilesController')
//apply middleware for all
// router.use([auth]);
const upload = require('../middlewares/upload');
const { upsertConfig, fetch_config } = require('../controllers/configController');
router.get('/', (req,res)=>{
    res.status(200).json({
        mess:'Hello world API'
    })
}); 

router.post('/rule',upsertRule);
router.get('/rule',getRuleExist);
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
// router.get('/user',fetchUser);
// router.delete('/user/:id',authIsAdmin,deleteUserById);
// router.put('/user',authIsAdmin,updateUserById);
//get data uploads
router.get('/receive', getMetadata);
router.post('/receive', receiveData);
router.delete('/receive/:id', deleteMetadata);
//process uploadfile metadata from frontend
router.post('/uploadData',upload.single('file'),ProcessUploadData)
//checkfile exist - hashfile api
router.post('/checkFiles', checkFiles);


module.exports = router;