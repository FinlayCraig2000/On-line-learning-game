const { request, response, json } = require("express");
const mysql = require("mysql");
const fs = require('fs');
const fyCookie = require("jsonwebtoken");
const { promisify } = require('util');
const { url } = require("inspector");

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

// Check to see if user requesting the file is the same id as there log in info
function checkUserRequest(userReq, res, location) {
    try {
        //console.log("User Req: ",userReq);

        const folderLocation = '/user-results/'
        const fileName = '-user-data.json'

        // Temp - need to make it flexiable for the user-results and user-data.json
        const userIDCheck =  folderLocation + userReq.id + fileName;
    
        //console.log(userIDCheck);
        //console.log(location);
        //console.log("Location: ",userIDCheck !== location);
        //console.log("Status: ",userReq.status === 'Student');
    
        if((userIDCheck !== location) && (userReq.status === 'Student')) {
            //console.log("Fail");
            return true;
        }

        //console.log("Pass");

    } catch (error) {
        //console.log(error);
        return true
    }

}

exports.jsonWrite = async (req, res) => {
    
    // const studentTeacher = req.body.studentTeacher add later on
    // console.log(req.user)
    //var { asdsa } = "test " + req.body;
    //console.log(asdsa)
    const { message } = req.body;
    console.log("Server message: ", message);

    console.log("URL Message: ", req.url);

    var boolQuestionsURL = false;

    
    if (req.url === "/questions/math-questions.json") {
        boolQuestionsURL = true;
    } else if (req.url === "/questions/english-questions.json") {
        boolQuestionsURL = true;
    }

    try {
        const decoded = await promisify(fyCookie.verify)(req.cookies.jwt, process.env.JWT_SECRET);

        db.query('SELECT * FROM users WHERE id = ?', [decoded.id], (error, result) => {
            console.log(result[0]);

            const messageUsername = result[0].username;
            // console.log(messageUsername);

            // Getting the server location
            const currentDir = process.cwd();
            var getRequestedFile = currentDir + '\\api\\' + req.url;

            console.log("File: ", getRequestedFile);
        
            fs.readFile(getRequestedFile, 'utf8', function (error, data) {
                if (error) {
                    console.log(error);
                };
                console.log("Data: ", data);
                myObj = JSON.parse(data);
                // console.log(myObj);
                // console.log(typeof myObj);
                
                var myObj, x= "";
                var a = 0;
            
                //myObj = JSON.parse("2-user-logs.json");
                
                // console.log("Bool Questions: ", boolQuestionsURL)

                if (boolQuestionsURL === false) {
                    for (x in myObj[0]["teacher-user-messages"][0]) {
                        a += 1;
                    }
            
                    myObj[0]["teacher-user-messages"].push({'message': messageUsername + ": " + message});
                    //console.log(myObj[0]["teacher-user-messages"]);

                    // myObj = {
                    //     "math-results": [
                    //         {"message": "2"},
                    //         {"message": "6"},
                    //         {"message": "2"},
                    //         {"message": "10"}
                    //     ],
                    
                    //     "english-results": [
                    //         {"message": "Cow"},
                    //         {"message": "House"},
                    //         {"message": "Hot"},
                    //         {"message": "Sleep"}
                    //     ]
                    // }
                }

                if (boolQuestionsURL === true) {
                    // Work upon
                    if (req.url === "/questions/math-questions.json") {
                        myObj = [{
                            "math-questions": [
                                {"message": "1+1"},
                                {"message": "2x3"},
                                {"message": "6/3"},
                                {"message": "5+5"}
                            ],
                        
                            "math-answers": [
                                {"message": "2"},
                                {"message": "6"},
                                {"message": "2"},
                                {"message": "10"}
                            ]
                        }];
                    }

                    if (req.url === "/questions/english-questions.json") {
                        myObj = [{
                            "english-questions": [
                                {"message": "Where do you get milk from?"},
                                {"message": "What do you live in?"},
                                {"message": "Summer is very..."},
                                {"message": "What does everyone do at night?"}
                            ],
                        
                            "english-answers": [
                                {"message": "Cow"},
                                {"message": "House"},
                                {"message": "Hot"},
                                {"message": "Sleep"}
                            ]
                        }]
                    }

                    console.log("Got here");
                }
                
                fs.writeFile(getRequestedFile, JSON.stringify(myObj), function(error) {
                    if (error) {
                        console.log(error);
                    }

                });
            })
        });
    } catch (error) {
        console.log(error)
    }


    return res.redirect('back');
}

exports.jsonRead = (req, res) => {
    try {
        // const temp = checkUserRequest(req.user, res, req.url)
    
        // if (temp) {
        //     return res.redirect("/login");
        // }
    
        // Getting the server location
        const currentDir = process.cwd();
        var getRequestedFile = currentDir + '\\api\\'+  req.url;
        
        // Debug console logs
        //console.log(req.url);
        //console.log(!fs.existsSync(getRequestedFile));
        //console.log(req.url === '/');
        
        // Check if file exists or not
        const stat = fs.statSync(getRequestedFile);
        //console.log(stat.isFile());
    
        if (!stat.isFile()) {
            return res.send("File not found");
            //return res.redirect('/login');//("File not found");
        }

        // Opening the file and sends back the information
        fs.readFile(getRequestedFile, 'utf8', function (error, data) {
            if (error) {
                console.log(error);
                return res.send("Error");
            };
            obj = JSON.parse(data);
            res.send(data);
        })

    } catch (error) {
        console.log(error);
        res.redirect('back')
    }
}