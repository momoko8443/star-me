//var config = require('../configuration/Config');
var request = require('request');
var express = require('express');
var querystring = require('querystring');
var cache = require('memory-cache');
// 重定向到github登录页面，获得用户授权

//request.defaults({'proxy':'http://web-proxy.jpn.hp.com:8080'});
module.exports = function (server, config) {
    var router = express.Router();
    var app = config.app;
    var oauth = config.oauth;

    function getAccessToken (opt){
        return new Promise(function(resolve,reject){
            request.post({url:oauth.access_token_url,formData:opt,json:true,proxy:'http://web-proxy.jpn.hp.com:8080'},
            function(error,response,body){
                if(error){
                    //logger.error(error);
                    reject(error);
                }
                else{
                    resolve(body.access_token);
                }
            });
        });
    }
    router.get('/', function (req, res) {
        var opt = {
            client_id: app.client_id,
            redirect_uri: app.redirect_uri,
            scope: app.scope,
            state: req.session.id,
            allow_signup: app.allow_signup
        };
        var url = oauth.authorization_url + '?' + querystring.stringify(opt);
        //logger.debug('Redirect to github to get code. URL=' + url);
        res.redirect(url);
    });
    // github会请求这个/authorization/oauth 路由带上code参数，凭此参数再次访问github接口可获得access_token,
    // 获得access_token成功后则视为整个认证过程成功，之后就可以通过该token请求具体的业务api了。
    router.get('/oauth', function (req, res) {
        code = req.query.code;
        var returnState = req.query.state;
        if (code && returnState) {
            var opt = {
                client_id: app.client_id,
                client_secret: app.client_secret,
                redirect_uri: app.redirect_uri,
                code: code,
                state: returnState
            };
            getAccessToken(opt)
                .then(function (token) {
                    cache.put(returnState,token);
                    res.redirect('/');
                })
                .catch(function (error) {
                    res.sendStatus(500);
                });
        } else {
            res.sendStatus(500);
        }
    });
    server.use('/authorization', router);
};