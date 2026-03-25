const express = require('express');
const router = express.Router();
const {register,signin,fetchUser,deleteUserById,updateUserById} = require('../controllers/usersController')
// const delay = require('../middlewares/testMiddle')
const {auth,authIsAdmin} = require('../middlewares/auth')


//apply middleware for all
router.use([auth]);

router.get('/', (req,res)=>{
    res.status(200).json({
        mess:'Hello world API'
    })
}); 

router.post('/register',register);
router.post('/login',signin);
router.get('/user',fetchUser);
router.delete('/user/:id',authIsAdmin,deleteUserById);
router.put('/user',authIsAdmin,updateUserById);

module.exports = router;