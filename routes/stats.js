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

router.get('/:id', function(req, res) {
    console.log("get Admin");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var sql = "select Conference_name, date ,[Registered] ,[Checkin]"
            sql = sql + "  from dbo.Conference c join dbo.Registration r  on  c.conference_id = r.conference_id"
            sql = sql + "   where Participant_id = @user"
            var r = new Request(sql, function() {
                console.log(results);
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