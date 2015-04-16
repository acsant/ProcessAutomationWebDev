//var express = require('express');
//var http = require('http');
//var bodyParser = require('body-parser');
//var app = express();
//app.use('/', express.static('./static')).
//	use('/images', express.static('../images')).
//	use('/lib', express.static('../lib'));
/*app.use(bodyParser());
var username = '';
var password = '';
var responseData = '';
function parseResponse(authResponse, res) {
	var authtoRet = '';
	authResponse.on('data', function(chunk) {
		authtoRet += chunk;
	});
	authResponse.on('end', function() {
		sendAuthenticationResponse (authtoRet, res);
	});
}

function sendAuthenticationResponse (toRet, res) {
	var newToRet = toRet.replace(/task-summary/g, 'taskSummary');
	console.log(newToRet);
	res.json(JSON.parse(newToRet));
}
app.post('/authenticate/portal', function(req, res) {
	username = req.body.usr;
	console.log(username);
	password = req.body.pass;
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
    parseResponse(responseData, res);
  }).end();
});

app.listen(8107);
*/

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser());
app.use(cookieParser());
app.use(expressSession({
	secret: 'SECRET',
	cookie: {maxAge: 60*60*1000}
}));
require('./routes')(app);
app.listen(8107);