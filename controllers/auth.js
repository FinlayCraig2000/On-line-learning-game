const { request, response, json } = require("express");
const mysql = require("mysql");
const fyCookie = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require('fs');
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

// exports.login = async (req, res) => {
//     try {
//         const { email, password} = req.body;

//         if(!email || !password) {
//             return res.status(400).render('login', {
//                 message: 'Please provide an email and password'
//             })
//         }

//         db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {
//             console.log("Login: ", results);
//             if (!results || !(await bcrypt.compare(password, results[0].password))){
//                 res.status(401).render('login', {
//                     message: 'Email or the password is incorrect'
//                 })
//             } else {
//                 const id = results[0].id;

//                 const token = fyCookie.sign({ id }, process.env.JWT_SECRET, { // id: id - just shorter
//                     expiresIn: process.env.JWT_EXPIRES_IN
//                 });

//                 console.log("The token is: " + token);

//                 const cookieOptions = {
//                     expires: new Date(
//                         Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
//                     ),
//                     httpOnly: true
//                 }

//                 res.cookie('jwt', token, cookieOptions);
//                 res.status(200).redirect("/Profile");
//             }
//         })

//     } catch (error) {
//         console.log(error)
//     }
// }

async function duplicateCheck(res, results, password, passwordConfirm) {
    if (results.length > 0) {
        return res.render('register', {
            message: 'That email is already in use'
        })
    } else if(password !== passwordConfirm) {
        return res.render('register', {
            message: 'Passwords do not match' 
        })
    }
}

async function hashData (inputData) {
    return bcrypt.hash(inputData, 8);
}

exports.register = (req, res) => {
    console.log(req.body);
    
    // const studentTeacher = req.body.studentTeacher add later on
    const { name , password, passwordConfirm, email, user } = req.body;

    if ((user !== 'Student') && (user !== 'Teacher')) {
        return res.render('register', {
            message: 'User status has changed'
        })
    }

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        
        if (results.length > 0) {
            return res.render('register', {
                message: 'That email is already in use'
            })
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'Passwords do not match' 
            })
        }

        let hashedPassword = await hashData(password);
        //console.log("Hash: ", hashedPassword);

        
        // Insert information into database
        db.query('INSERT INTO users SET ?', {username: name, email: email, password: hashedPassword, status: user}, (error, results) => {
            if(error){
                console.log(error);
            } else {
                //console.log(results)
                return res.render('register', {
                    message: 'User registered' 
                }) 
            }
        })
        
        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {

            // Create Json Data Template
            var dictstring = JSON.stringify({ test: "Test" });
            
            // Save Json {"file location : file name"} with current directory
            const jsonName = {"\\api\\user-results\\": "-user-data.json", "\\api\\user-logs\\": "-user-logs.json"};
            const currentDir = process.cwd();
            const id = results[0].id;
            
            // Create Json into api folder
            for (const item in jsonName) {
                fs.writeFile(currentDir + `${item}` + id + `${jsonName[item]}`, dictstring, function(error, result) {
                    if(error) {
                        console.log("Json Creation:", error);
                    }
                });
            }
        })
    });
}

exports.isLoggedIn = async (req, res, next) => {
    //console.log(req.cookies);
    if (req.cookies.jwt) {
        try {
            // Getting what user is logged in from a cookie
            const decoded = await promisify(fyCookie.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            //console.log("Logout: ", decoded);

            // Check if user is in database
            db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
                //console.log(result);

                if (!result) {
                    return next();
                }

                req.user = result[0];
                return next();
            });

        } catch (error) {
            //console.log(error)
            return next();
        }
    } else {
        next();
    }
}

exports.logout = async (req, res) => {
    // Replace cookie and remove it
    res.cookie('jwt', 'ACookieYouWontSee', {
        expires: new Date(
            Date.now() + 2*1000
        ),
        httpOnly: true
    });

    res.status(200).redirect('/')
}