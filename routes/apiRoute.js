// This server route needs to be secure so only logged in users can see there json files

const { request } = require("express");
const express = require("express");
const mysql = require("mysql");
const fs = require('fs');
const authController = require('../controllers/auth');
const jsonWriteController = require("../controllers/profileAuth");

const router = express.Router();

// Get server files
router.get('/*', authController.isLoggedIn, jsonWriteController.jsonRead);

// Request files with POST
router.post('/*', jsonWriteController.jsonWrite);

module.exports = router;