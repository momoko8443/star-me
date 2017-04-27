var express = require('express');
var session = require('express-session');
var path = require('path');
var config = require('./conf/config');
var MongoStore = require('connect-mongo')(session);
var bodyParser = require('body-parser');
var server = require('star-me-api');

var app = express();

app.use(session({
  secret: 'starme',
  saveUninitialized: true,
  resave: false,
  store: new MongoStore(
    {
      url: 'mongodb://localhost/session',
      ttl: 1 * 1 * 5 * 60 // = 14 days. Default
      // autoRemove: 'interval',
      // autoRemoveInterval: 10
    })
}));

app.use(express.static(path.join(__dirname, 'node_modules/star-me-ui')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

server.auth(app, config);
server.api(app, config);

app.listen(8080, function () {
  console.log("listening on 8080");
});
