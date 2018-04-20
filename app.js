var express = require('express');

var http = require('http')

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
var formidable = require('formidable');

var fs = require('fs');

require('./config/passport')(passport); // pass passport for configuration
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
console.log("hi");


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

var pool = mysql.createPool({
  host: 'localhost',
  user: 'Daniel',
  password: 'hereisthepass',
  database: 'dataproject'
})
pool.getConnection(function(err, connection) {
  if (err) throw err;
  //Nothing goes here yet
});
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
index(app, passport);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
module.exports = app;
