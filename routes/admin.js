var express = require('express');
var router = express.Router();

//database connection
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var config = {
    server: '\localhost',
userName: 'nono',
password: 'kokou2008'
,options: {
database: 'Conference'
    }
};



router.get('/:username-:password-:admin', function(req, res) {
    console.log("is admin");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("select * from [Participant] where [username]= @username and [password] = @password and IsAdmin = 1", function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
                res.send(results);
            });
            r.addParameter('username', TYPES.VarChar, req.params.username);
            r.addParameter('password', TYPES.VarChar, req.params.password);
            //r.addParameter('admin', TYPES.VarChar, req.params.admin);
            r.on("row", function(row) {
                var rowdata = new Object();
                row.forEach(function(column) {
                    rowdata[column.metadata.colName] = column.value;
                });
                results.push(rowdata);
            });
            this.execSql(r);
        }
    });
});
router.post('/:id', function(req, res) {
    console.log("GEt pp")
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("select * from [Participant] where [Participant_id]= @username", function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
                res.send(results);
            });
            r.addParameter('username', TYPES.Int, req.params.id);
            r.on("row", function(row) {
                var rowdata = new Object();
                row.forEach(function(column) {
                    rowdata[column.metadata.colName] = column.value;
                });
                results.push(rowdata);
            });
            this.execSql(r);
        }
    });
});

router.put('/:id',function(req,res){
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var sql1 = "Update dbo.Conference set [Place_available] = [Place_available] - 1 where [conference_id] = " + req.params.id ;
            console.log(sql1);
            var r = new Request(sql1, function() {
                res.send(results);
            });
            r.on("row", function(row) {
                var rowdata = new Object();
                row.forEach(function(column) {
                    rowdata[column.metadata.colName] = column.value;
                });
                results.push(rowdata);
            });
            this.execSql(r);
        }
})
});
module.exports = router;