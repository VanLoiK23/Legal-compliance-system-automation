require('dotenv').config();
const port = process.env.PORT || 5000;
const path = require('path');

const cors = require('cors')

const express = require('express');
const app = express();

app.use(cors())

const session = require('express-session');
const flash = require('connect-flash');

const webRoutes = require('./src/routes/web');
const adminRoutes = require('./src/routes/admin');
const apiRoutes = require('./src/routes/api');

const  {requireAdmin,requireLogin}= require('./src/middlewares/authMiddleware');

const configViewEngine = require('./src/config/viewEngine');
const connection = require('./src/config/database');

//config session
app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // localhost: false , https :true
}));

//config req.body
app.use(express.json()) // for json
app.use(express.urlencoded({ extended: true })) // for form data

//config template engine
configViewEngine(app);

//config static files: image/css/js
app.use(express.static(path.join(__dirname, 'public')));
//active flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.session.user; 
    res.locals.error = req.flash('error'); //hiển thị xog tự xóa
    res.locals.message = req.flash('message');
    next();
});

// ROUTING
app.use('/admin', requireLogin, requireAdmin, adminRoutes);

app.use('/', webRoutes);

//api
app.use('/v1/api',apiRoutes);

(async () => {
    try {
        //using mongoose
        await connection();

        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`)
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error)
    }
})()
