var express = require('express');
var request = require('request');
var UserGithub = require('../services/github/UserGithub');
var cache = require('memory-cache');

module.exports = function (server, config) {
    var router = express.Router();
    var userGithub = new UserGithub(config);
    router.get('/authenticatedUser', function (req, res) {
        if(req.session.user){
            res.send(req.session.user);
        }else{
            var token = cache.get(req.session.id);
            if (token) {
                userGithub.getAuthenticatedUser(token).then(function (user) {
                    req.session.user = user;
                    req.session.save(function(err){
                        res.send(user);
                    }); 
                });
            } else {
                res.end();
            }
        }
        
    });

    server.use('/api', router);
};