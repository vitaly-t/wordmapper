var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');
var passport = require('passport');
var query = require('../query');
var router = express.Router();

var urlencodedParser = bodyParser.urlencoded({ extended: false });

// Index
router.get('/', function(req, res) {
	res.send('Welcome to the user interface!')
});

// Profile
router.get('/:userId(\\d+)', function(req, res) {
	res.send("User: " + req.params.userId);
});

// Login
router.route('/login')
.get(function(req, res) {
	res.render('login');
})
.post(urlencodedParser, passport.authenticate('local'), function(req, res) {
	winston.info("User logged via local authentication: " + req.body.email);
	res.redirect('/');
});

// Logout
router.route('/logout')
.get(function(req, res) {
  req.logout();
  res.redirect('/');
});

// Registration
router.route('/register')
.get(function(req, res) {
	res.render('register');
})
.post(urlencodedParser, function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	query.users.createUser(email, password).then(function() {
		return query.users.promoteFirstUser(email);
	}).then(function() {
		winston.info("Account created successfully: ", email);
		res.send("Account created successfully!");
	}).catch(function(err) {
		winston.error("Error creating account: ", err);
		res.send("Error creating your account");
	});
});

module.exports = router;
