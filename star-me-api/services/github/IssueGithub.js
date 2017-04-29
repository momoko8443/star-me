var request = require('request');

function IssueGithub(config) {
    var api = config.api;
    var app = config.app;

    this.create = function (token, title, body) {
        return new Promise(function (resolve, reject) {
            if (token) {
                var headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token };
                request({
                    url: api.issue,
                    json: true,
                    method: 'POST',
                    headers: headers,
                    proxy: 'http://web-proxy.jpn.hp.com:8080',
                    body: {
                        title: title,
                        body: body,
                        labels: ['recommend']
                    }
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

    this.addComment = function (token, issue_id, body) {
        return new Promise(function (resolve, reject) {
            if (token && issue_id) {
                var url = api.comment.replace('{0}', issue_id);
                console.log(url);
                var headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token };
                request({
                    url: url,
                    json: true,
                    method: 'POST',
                    headers: headers,
                    proxy: 'http://web-proxy.jpn.hp.com:8080',
                    body: {
                        body: body
                    }
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

    this.findOne = function (token, repoName) {
        return new Promise(function (resolve, reject) {
            var url = api.search + '/issues?q=' + repoName + '+in:title+label:recommend+state:open+repo:momoko8443/star-me+type:issue&type=Issues';
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

    this.findAll = function (token) {
        return new Promise(function (resolve, reject) {
            var url = api.issue + '?state=open&labels=recommend';
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

module.exports = IssueGithub;