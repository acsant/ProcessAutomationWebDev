var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var http = require('http');
var qstring = require('querystring');
app.use(bodyParser());
var username = '';
var password = '';
var responseData = '';
workItemList = [];

var options = {
    host: 'localhost',
    port: 8080,
    path: '/jbpm-console/rest/task/query',
    method: 'GET',
    headers: {
    	
    }
 };


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
	if (newToRet) {
		console.log(newToRet);
		req.session.regenerate(function() {
			req.session.taskList = JSON.parse(newToRet).taskSummaryList;
			req.session.username = username;
			req.session.password = password;
			//getContentModel(req, JSON.parse(newToRet).taskSummaryList, res);
			res.json(JSON.parse(newToRet).taskSummaryList);
		});
	}

}

exports.login = function (req, res) {
	if (req.body.username) {
		req.session.regenerate(function () {
			req.session.username = req.body.username;
			req.session.password = req.body.password;
			res.redirect('/');
		});
	}
}

exports.getTaskList = function(req, res) {
	username = req.session.username;
	password = req.session.password;
	options.path = '/jbpm-console/rest/task/query';
	options.method = 'GET';
	options.headers = {
    	'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
		'Accept': 'application/json'
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
	options.path = '/jbpm-console/rest/task/' + id + '/start';
	options.method = 'POST';
	options.headers = {
    	'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
		'Accept': 'application/json'
    };
	var resData = '';
	var request = http.request(options, function (response) {
		response.setEncoding('utf8');
		response.on('data', function (chunk) {
			resData += chunk;
		});
		var taskList = req.session.taskList;
		res.redirect('/');
		
	}).end();
	
 }

 exports.createTask = function (req, res) {
 	username = req.session.username;
 	password = req.session.password;
 	var employeeName = req.body.employee;
 	var reqReason = req.body.reason;
 	var postData = qstring.stringify({
 		'map_reason': reqReason,
 		'map_employee': employeeName
 	});
	options.path = '/jbpm-console/rest/runtime/org.jbpm:Evaluation:1.0/withvars/process/evaluation/start';
	options.method = 'POST';
	options.headers = {
			'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
			'Content-Type': 'application/x-www-form-urlencoded',
          	'Content-Length': postData.length,
          	'Accept': 'application/json'

		};
	var request = http.request(options, function (response) {
		response.setEncoding('utf8');
		if (response.statusCode == 200) {
			res.redirect('/');
		}
	});
	request.write(postData);
	request.end();
 }
