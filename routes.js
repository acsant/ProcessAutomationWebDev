var express = require('express');
var crypto = express('crypto');
module.exports = function (app) {
	var user = require('./controllers/user_controller');
	app.use('/static', express.static('./static')).
			use('/lib', express.static('../lib')
		);
	app.get('/', function(req, res) {
		console.log(req.session);
		console.log(req.body);
		if (req.session.username) {
			console.log('Authenticated');
			res.render('authentication', {taskList: req.session.taskList});
		} else {
			res.redirect('/login');
		}
	});
	app.get('/login', function(req, res) {
		if (req.session.taskList) {
			res.redirect('/');
		} else {
			res.render('login');
		}
	});
	app.get('/logout', function (req, res) {
		req.session.destroy(function () {
			res.redirect('/login');
		});
	});
	app.post('/login', user.login);
	app.post('/getTaskList', user.getTaskList);
	app.post('/startTask', user.startTask);
};