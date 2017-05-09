var request = require('request');

function RepoGithub(config) {
    var api = config.api;
    var app = config.app;
    var self = this;
    this.star = function (token, repoName) {
        return new Promise(function (resolve, reject) {
            if (token) {
                var url = api.star + '/' + repoName;
                console.log(url);
                headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token, 'Content-Length':0};
                request({
                    url: url,
                    json: true,
                    headers: headers,
                    method: 'PUT',
                    proxy: 'http://web-proxy.jpn.hp.com:8080'
                }, function (error, response, body) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(body);
                    }
                });
            } else {
                reject();
            }
        });
    };

    this.findOne = function(token,repoName){
        return new Promise(function(resolve,reject){
            var url = api.repo + '/' + repoName;
            var headers = { 'User-Agent': app.app_name };
            if (token) {
                headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token };
            }
            request({
                url: url,
                json: true,
                headers: headers,
                proxy: 'http://web-proxy.jpn.hp.com:8080'
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    };

    this.getContent = function(token, repoName, fileName){
        return new Promise(function(resolve, reject){
            var url = api.repo + '/' + repoName + '/contents/' + fileName;
            console.log(url);
            var headers = { 'User-Agent': app.app_name };
            if (token) {
                headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token };
            }
            request({
                url: url,
                json: true,
                headers: headers,
                proxy: 'http://web-proxy.jpn.hp.com:8080'
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    };

    this.getREADME = function(token, repoName){
        return new Promise(function(resolve,reject){
            self.getContent(token,repoName,'README.md').then(function(result){
                if(result && result.download_url){
                    request({
                        url: result.download_url,
                        proxy: 'http://web-proxy.jpn.hp.com:8080'
                    }, function (error, response, body) {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(body);
                        }
                    });
                }else{
                    reject();
                }
            })
        });
    };

    this.search = function (token, keyword) {
        return new Promise(function (resolve, reject) {
            var fields = ['name'];
            var limits = ['stars:<100'];
            var url = api.search + '/repositories?q=' + keyword + '+in:' + fields.join(',') + '+' + limits.join('+') + '&type=Repositories&per_page=50';
            console.log(url);
            var headers = { 'User-Agent': app.app_name };
            if (token) {
                headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token };
            }
            request({
                url: url,
                json: true,
                headers: headers,
                proxy: 'http://web-proxy.jpn.hp.com:8080'
            }, function (error, response, body) {
                if (error) {
                    reject(error);
                } else {
                    resolve(body);
                }
            });
        });
    };
}

module.exports = RepoGithub;