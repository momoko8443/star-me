var express = require('express');
var UserGithub = require('../services/github/UserGithub');
var RepoGithub = require('../services/github/RepoGithub');
var IssueGithub = require('../services/github/IssueGithub');
var cache = require('memory-cache');

module.exports = function (server, config) {
    var router = express.Router();
    var userGithub = new UserGithub(config);
    router.get('/authenticatedUser', function (req, res) {
        if (req.session.user) {
            res.send(req.session.user);
        } else {
            var token = cache.get(req.session.id);
            if (token) {
                console.log(token);
                userGithub.getAuthenticatedUser(token).then(function (user) {
                    req.session.user = user;
                    req.session.save(function (err) {
                        res.send(user);
                    });
                });
            } else {
                res.end();
            }
        }

    });
    var repoGithub = new RepoGithub(config);
    router.get('/search/:keyword', function (req, res) {
        var keyword = req.params.keyword;
        if (keyword) {
            var token = cache.get(req.session.id);
            repoGithub.search(token,keyword).then(function (result) {
                result.items.forEach(function(item){
                    if(repos_cache[item.full_name]){
                        item.extra = repos_cache[item.full_name].extra;
                    }
                });
                res.send(result.items);
            }).catch(function (err) {
                console.log(err);
            })
        } else {
            res.end();
        }
    });

    var issueGithub = new IssueGithub(config);
    var repos_cache = {};
    router.get('/repos', function(req, res){
        var token = cache.get(req.session.id);
        issueGithub.findAll(token).then(function(result){
                //repos_cache = result;
            var tmp = [];
            result.forEach(function (element) {
                var repo = JSON.parse(element.body);
                repo.extra = {comments_count:element.comments};
                tmp.push(repo);
                repos_cache[repo.full_name] = repo;
            });
            res.send(tmp);
        });
    });

    router.get('/repos/:name',function(req,res){
        var token = cache.get(req.session.id);
        var repoName = decodeURIComponent(req.params.name);
        repoGithub.getREADME(token,repoName).then(function(result){
            res.send(result);
        });
    });

    router.post('/repos/:name/comments', function(req, res){
        var repoName = decodeURIComponent(req.params.name);
        var comment = req.body.body;
        var repo = req.body.repo;
        var repoName = repo.full_name;
        var token = cache.get(req.session.id);
        var current_issue = null;
        issueGithub.findOne(token,repoName)
        .then(function(result){
            if(result && result.total_count === 1){
                return result.items[0];
            }else{
                //not exist, create a new issue
                var title = '[recommend] ' + repoName;
                //var body = JSON.stringify(repo);
                return issueGithub.create(token,title,'').then(function(issue){
                    return result;
                });
            }
        })
        .then(function(issue){
            current_issue = issue;
            return issueGithub.addComment(token,issue.number,comment).then(function(result){
                if(result === 'Created'){
                    return;
                }
            });
        })
        .then(function(){
            return repoGithub.star(token,repoName).then(function(result){
                if(result === undefined){
                    return;
                }         
            })
        })
        .then(function(){
            return repoGithub.findOne(token,repoName).then(function(repo){
                return repo;
            })
        })
        .then(function(repo){
            var body = JSON.stringify(repo);    
            issueGithub.edit(token,current_issue.number,body).then(function(issue){
                res.send(repo);
            });
        });     
    });


    server.use('/api', router);
};