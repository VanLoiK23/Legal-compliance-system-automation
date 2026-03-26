const express = require('express');
const router = express.Router();
// const {register,signin,fetchUser,deleteUserById,updateUserById} = require('../controllers/usersController')
const {upsertRule,getRuleExist,insertLog,fetchLog} = require('../controllers/ruleController')
const {auth,authIsAdmin} = require('../middlewares/auth')
const { receiveData ,getMetadata, deleteMetadata} = require('../controllers/metadataController');

//apply middleware for all
// router.use([auth]);

router.get('/', (req,res)=>{
    res.status(200).json({
        mess:'Hello world API'
    })
}); 

router.post('/rule',upsertRule);
router.get('/rule',getRuleExist);
router.post('/logging',insertLog);
router.get('/logging',fetchLog);
// router.get('/user',fetchUser);
// router.delete('/user/:id',authIsAdmin,deleteUserById);
// router.put('/user',authIsAdmin,updateUserById);
//get data uploads
router.get('/receive', getMetadata);
router.post('/receive', receiveData);
router.delete('/receive/:id', deleteMetadata);

module.exports = router;