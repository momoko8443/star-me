var express = require('express');
var session = require('express-session');
var path = require('path');
var MongoStore = require('connect-mongo')(session);

var apiRouter = require('star-me-api');

 var app = express();

app.use(session({
  secret: 'starme',
  saveUninitialized: true, 
  resave: false,
  store: new MongoStore(
    { url: 'mongodb://localhost/session',
      autoRemove: 'interval',
      autoRemoveInterval: 10 
    })
}));

app.use(express.static(path.join(__dirname, 'node_modules/star-me-ui')));


apiRouter(app);

var server = app.listen(8080);
