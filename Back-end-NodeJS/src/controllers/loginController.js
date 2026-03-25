const User = require('../models/user');

const getForm = async (req, res)=>{    
    res.render('login');
}

const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        const user = await User.findOne(name);

        if (!user) {
            req.flash('error', 'User not found');
            return res.redirect('/login');
        }

        const isMatch = user.password === password; 
        
        if (!isMatch) {
            req.flash('error', 'Password incorrect');

            return res.redirect('/login');
        }

        req.session.user = user;

        if (user.role === 'admin') {
            return res.redirect('/admin');
        }

        console.log("success")
        
        req.flash('message', 'Login Successfully');

        return res.redirect('/');

    } catch (err) {
        console.log(err);
        req.flash('error', 'System error');

        return res.redirect('/login');
    }
}

const logout =async (req,res)=>{
    req.session.user = null;
    res.locals.currentUser = null;

    res.redirect('/');
}

module.exports = {getForm,login,logout}
