var express = require('express');
var session = require('express-session');
var path = require('path');
var config = require('./conf/config');
var bodyParser = require('body-parser');
var server = require('star-me-api');

var app = express();

app.use(session({
  secret: 'starme',
  saveUninitialized: true,
  resave: false,
  cookie:{
    maxAge: 1800000,
    secure: false
  }
}));

app.use(express.static(path.join(__dirname, 'node_modules/star-me-ui')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.use(function(res,req,next){
  console.log(res.sessionID);
  next();
})

server.auth(app, config);
server.api(app, config);

app.listen(8080, function () {
  console.log("listening on 8080");
});
