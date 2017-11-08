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
            var sql = "Select *,";
                sql = sql + "   'This Event starts at '+ [Start_time] + ' and ends at ' +  [End_time] +'. The guest speaker is '+ [Guest_speaker]  + '. The location will be at '+  [Location] + ' and it is organised by '+ [Organiser] +' .This is a description of the event :' + [Description] as Descrition1 ";
                sql = sql + " FROM [Conference].[dbo].[Conference]"
            var r = new Request(sql, function() {
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
router.get('/:id', function(req, res) {
    console.log("get Admin");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("select * from [Conference] where [conference_id]= @user", function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
                res.send(results);
            });
            r.addParameter('user', TYPES.Int, req.params.id);
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

module.exports = router;