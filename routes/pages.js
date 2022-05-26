const { request } = require("express");
const express = require("express");
const authController = require('../controllers/auth');


const router = express.Router();

// Check to see if user has logged in
function checkLoggedIn(userReq, res, location) {
    // Temp - create function to pass in all user ids depending on teacher or student
    const jsonDataScores = require('../api/user-results/' + userReq.user.id + '-user-data.json');
    // console.log(userReq.user.id)

    var teacherStatus = false;
    var studentStatus = false;

    if (userReq.user.status === "Teacher") {
        teacherStatus = true;
    }

    if (userReq.user.status === "Student") {
        studentStatus = true;
    }

    if(userReq) {
        res.render(location, {
            user: userReq.user,
            teacherStatus: teacherStatus,
            studentStatus: studentStatus,
            jsonUserData: jsonDataScores
        });   
    }
    else {
        res.redirect('/login');
    }
}

//console.log(require('../server/80-user-data.json'));

// Default Pages
router.get('/', (req, res) => {
    res.render('index');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/login', authController.isLoggedIn, (req, res) => {
    //checkLoggedIn(req.user, res, 'profile') // Pretty much a loop, check if user has cookie
    res.render('login');
});


// When user is logged in
router.get('/profile', authController.isLoggedIn, (req, res) => {
    checkLoggedIn(req, res, 'profile');
})

router.get('/messages', authController.isLoggedIn, (req, res) => {
    checkLoggedIn(req, res, 'messages');
})

router.get('/settings', authController.isLoggedIn, (req, res) => {
    //console.log(req);
    checkLoggedIn(req, res, 'settings');
})


module.exports = router;