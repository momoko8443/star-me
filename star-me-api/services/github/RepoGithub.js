var request = require('request');

function RepoGithub(config){
    var api = config.api;
    var app = config.app;
    
    this.search = function(token,keyword){
        return new Promise(function(resolve, reject){
            var fields = ['name'];
            var limits = ['stars:<100'];
            var url = api.search + '/repositories?q=' + keyword + '+in:'+ fields.join(',') + '+' + limits.join('+') + '&type=Repositories&per_page=50';
            console.log(url);
            var headers = {'User-Agent': app.app_name};
            if(token){
                headers = { 'User-Agent': app.app_name, Authorization: 'token ' + token };
            }
            request({
                url: url,
                json: true,
                headers: headers,
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

module.exports = RepoGithub;