var express = require('express');

module.exports = function(server){

    var router = express.Router();
    router.route('/auth').get(function(req,res){
        res.send({user:"momoko"});
    });
    server.use('/api',router);
};