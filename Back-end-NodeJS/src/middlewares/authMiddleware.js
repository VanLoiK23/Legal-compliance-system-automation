const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin') {
        return res.send('<h1>CẤM TRUY CẬP! Bạn không phải là Admin.</h1><br><a href="/>Back to homepage</a>');
    }
    next(); // is Admin
};

const redirectIfLoggedIn = (req, res, next) => {
    if (req.session.user) {
        req.flash('error', 'You"ve already logged');

        return res.redirect('/');
    }
    next();
};

module.exports = { requireLogin, requireAdmin,redirectIfLoggedIn };