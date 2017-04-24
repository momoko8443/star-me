var express = require('express');
var authRouter = require('./routers/oauth');
var apiRouter = require('./routers/api');

module.exports = {
    auth:authRouter,
    api:apiRouter
};