var express = require('express');

var app = express();

var path = require('path');

var index = require('./Routes/program.js');

var mysql = require('mysql');

var passport = require('passport'); //Passport for authentication

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser');

var logger = require('morgan'); //Note logger = morgan~!

var session = require('express-session');

var flash = require('connect-flash');

require('./config/passport')(passport); // pass passport for configuration
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
console.log("hi");
app.listen(3000);

app.use(logger('dev')); //log every request to the CONSOLE.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session( {secret: 'thenamesovbyeahyouknowmeimtheironchancellorofgermanyyeahyoubetterbringthegameifyousteptomecauseimthemasterofforeignpolicywhat',
                  resave: true,
                  saveUninitialized: true,
                  cookie: {maxAge: 3600 * 1000}} ));
// ^ session secret (why do I do this to myself...) is just to add random-ness to the password encryption
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'Daniel',
  password: 'gogogo123',
  database: 'dataproject'
})
connection.connect(function(err)
{
  if(err) throw err;
  console.log("Connected!");
  connection.end();
});
index(app, passport);
module.exports = app;
