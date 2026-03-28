const express = require('express');
const router = express.Router();
// const {register,signin,fetchUser,deleteUserById,updateUserById} = require('../controllers/usersController')
const {upsertRule,getRuleExist,updateRule,deleteRule,insertLog,fetchLog} = require('../controllers/ruleController')
const {auth,authIsAdmin} = require('../middlewares/auth')
const { receiveData ,getMetadata, deleteMetadata} = require('../controllers/metadataController');
const {ProcessUploadData} =  require('../controllers/uploadDataController')
//apply middleware for all
// router.use([auth]);
const upload = require('../middlewares/upload');
router.get('/', (req,res)=>{
    res.status(200).json({
        mess:'Hello world API'
    })
}); 

router.post('/rule',upsertRule);
router.get('/rule',getRuleExist);
router.put('/rule',updateRule);
router.delete('/rule/:rule_id',deleteRule);
router.post('/logging',insertLog);
router.get('/logging',fetchLog);
// router.get('/user',fetchUser);
// router.delete('/user/:id',authIsAdmin,deleteUserById);
// router.put('/user',authIsAdmin,updateUserById);
//get data uploads
router.get('/receive', getMetadata);
router.post('/receive', receiveData);
router.delete('/receive/:id', deleteMetadata);
//process uploadfile metadata from fontend
router.post('/uploadData',upload.single('file'),ProcessUploadData)

module.exports = router;