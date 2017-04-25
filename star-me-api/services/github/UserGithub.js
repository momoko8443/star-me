var request = require('request');

function UserGithub(config) {
    var api = config.api;
    var app = config.app;

    this.getAuthenticatedUser = function (token) {
        return new Promise(function (resolve, reject) {
            request({
                url: api.user,
                json: true,
                headers: { 'User-Agent': app.app_name, Authorization: 'token ' + token },
                proxy:'http://web-proxy.jpn.hp.com:8080'
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

module.exports = UserGithub;