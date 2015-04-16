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