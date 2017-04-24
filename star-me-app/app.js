var express = require('express');
var session = require('express-session');
var path = require('path');
var config = require('./conf/config');
var MongoStore = require('connect-mongo')(session);

var server = require('star-me-api');

var app = express();

app.use(session({
  secret: 'starme',
  saveUninitialized: true,
  resave: false,
  store: new MongoStore(
    {
      url: 'mongodb://localhost/session',
      autoRemove: 'interval',
      autoRemoveInterval: 10
    })
}));

app.use(express.static(path.join(__dirname, 'node_modules/star-me-ui')));


server.auth(app, config);
server.api(app, config);

app.listen(8080, function () {
  console.log("listening on 8080");
});
