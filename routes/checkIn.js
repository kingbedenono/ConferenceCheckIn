var express = require('express');
var router = express.Router();

//database connection
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
var config = {
    server: '\localhost',
userName: 'nono',
password: 'kokou2008',
options: {
database: 'Conference',
//trustedConnection: true
            //rowCollectionOnDone : true,
            //useColumnNames : true,
    }
};

router.get('/', function(req, res) {
    console.log("get all");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("select * from [Conference].[dbo].[Conference]", function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
               // console.log(results);
                res.send(results);
            });
            r.on("row", function(row) {
                var rowdata = new Object();
                row.forEach(function(column) {
                    rowdata[column.metadata.colName] = column.value;
                });
               // console.log(rowdata);
                results.push(rowdata);
            });
            this.execSql(r);
        }
    });
});
// for admin
router.get('/:id-:confId', function(req, res) {
    console.log("get register check");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("SELECT [Registered] FROM [Conference].[dbo].[Registration] where [Participant_id] = @id and [conference_id] = @confid", function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
                console.log(results)
                res.send(results);
            });
            r.addParameter('id', TYPES.Int, req.params.id);
            r.addParameter('confid', TYPES.Int, req.params.confId);
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

router.post('/:id-:confId-:placeAv', function(req, res) {
    console.log("in post");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var sql = "INSERT INTO [dbo].[Registration]  ([Participant_id] ,[conference_id]  ,[Registered])  ";
                sql = sql + " VALUES("+ req.params.id+" , " + req.params.confId + " , '" + new Date().toDateString() + "') ";
            console.log(sql);
            var r = new Request(sql, function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
                res.send(results);
            });
            this.execSql(r);
        }
    });
});
router.put('/:id-:confId', function(req, res) {
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var sql = "UPDATE [dbo].[Registration] " ;
            sql = sql + " SET [Checkin] =  '" +  new Date().toDateString(); 
            sql = sql + "'  WHERE [conference_id] = " + req.params.confId +" and [Participant_id] = "+ req.params.id;
            //sql = sql + "'  WHERE [conference_id] = " + req.params.confId +" and [Participant_id] = " + req.params.id;
            console.log(sql);
            var r = new Request(sql, function() {
                res.send(results);
            });
            this.execSql(r);
        }
    });
});

module.exports = router;