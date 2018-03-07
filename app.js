var express = require('express');
var engines = require('consolidate');
var app = express();
var path = require('path');
var index = require('./startwithexpress/program.js')
app.set('views', __dirname + '/views');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
index(app);
console.log("hi");
app.listen(3000);
