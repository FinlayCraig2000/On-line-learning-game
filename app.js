const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const { request } = require("http");

dotenv.config({ path: './.env' })

const app = express();

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
}); // Can create file as using it two times.

// Public folder visable middleware
const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Parse URL-encoded bodies (as send by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as send by API forms)
app.use(express.json());
app.use(cookieParser());

app.set('view engine', 'hbs');

db.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log("MYSQL Connected...")
    }
})

// Define Routes

app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


// Server folder visable middleware - Try and make is locked behind user cookie
//const serverDirectory = path.join(__dirname, './server');
//app.use('/server', express.static(serverDirectory));

app.use('/api', require('./routes/apiRoute'));
app.use('/api', require('./routes/apiRoute'));

app.listen(5000, () => {
    console.log("Server started on Port 5000");
})