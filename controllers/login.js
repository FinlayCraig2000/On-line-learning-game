const { request, response, json } = require("express");
const mysql = require("mysql");
const fyCookie = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { promisify } = require('util');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

// IF ADMIN SEND ALL USER IDs WHICH AREN'T TEACHERS

async function inputUserDataCheck (res, email, password) {
    if(!email || !password) {
        return true;
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password} = req.body;

        // Check to see if there is any data in email or password
        if (await inputUserDataCheck(res, email, password) === true) {
            return res.status(400).render('login', {
                message: 'Please provide an email and password'
            })
        };

        // Check to see if inputted information is correct 
        db.query('SELECT * FROM users WHERE email = ?', [email], async(error, results) => {

            console.log(results);
            
            if (!results) {
                console.log(results[0].email);
            }


            //console.log(await bcrypt.compare(password, results[0].password));
            
            if (await bcrypt.compare(password, results[0].password)){

                // Setting up cookie
                const id = results[0].id;
                
                // id: id - just shorter
                const token = fyCookie.sign({ id: id }, process.env.JWT_SECRET, {
                    expiresIn: process.env.JWT_EXPIRES_IN
                });

                // Create new cookie for a month
                const cookieOptions = {
                    expires: new Date(
                        Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                    ),
                    httpOnly: true
                }

                // Redirect user with cookie of infomation
                res.cookie('jwt', token, cookieOptions);
                res.status(200).redirect("/Profile");

            } else {
                res.status(401).render('login', {
                    message: 'Email or the password is incorrect'
                })
            }
        })

    } catch (error) {
        console.log(error)
    }
}