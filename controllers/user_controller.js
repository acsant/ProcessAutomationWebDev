var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var qstring = require('querystring');
app.use(bodyParser());
var username = '';
var password = '';
var responseData = '';
function parseResponse(req, authResponse, res) {
	var authtoRet = '';
	authResponse.on('data', function(chunk) {
		authtoRet += chunk;
	});
	authResponse.on('end', function() {
		sendAuthenticationResponse (req, authtoRet, res);
	});
}



function sendAuthenticationResponse (req, toRet, res) {
	var newToRet = toRet.replace(/task-summary/g, 'taskSummary');
	//console.log(newToRet);
	//res.json(JSON.parse(newToRet));
	if (newToRet) {
		req.session.regenerate(function() {
			req.session.taskList = JSON.parse(newToRet).taskSummaryList;
			req.session.username = username;
			req.session.password = password;
			res.json(JSON.parse(newToRet).taskSummaryList);
		});
	}

}

exports.login = function (req, res) {
	console.log('Post login is called');
	console.log(req.body.username);
	if (req.body.username) {
		console.log(req.body.username);
		req.session.regenerate(function () {
			req.session.username = req.body.username;
			req.session.password = req.body.password;
			res.redirect('/');
		});
	}
}

exports.getTaskList = function(req, res) {
	console.log('Controller is called');
	username = req.session.username;
	password = req.session.password;
	console.log(username);
	var options = {
    host: 'localhost',
    port: 8080,
    path: '/jbpm-console/rest/task/query',
    method: 'GET',
    headers: {
    	'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
		'Accept': 'application/json'
    }
  };
  	http.request(options, function(response){
    responseData = response;
    parseResponse(req, responseData, res);
  	}).end();

}

exports.startTask = function (req, res) {
	username = req.session.username;
	password = req.session.password;
    var id = req.body.taskId;
    console.log(id);
	var options = {
		host: 'localhost',
		port: 8080,
		path: '/jbpm-console/rest/task/' + id + '/start',
		method: 'POST',
		headers: {
			'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
		}
	};	

	var resData = '';
	var request = http.request(options, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			resData += chunk;
		});
		console.log(response.statusCode);
		console.dir(response);
		console.log(username);
		console.log(password);
		console.log(id);
		console.log(response.statusMessage);
		var taskList = req.session.taskList;
		res.redirect('/');
		
	}).end();
	
 }