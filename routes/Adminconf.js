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
database: 'Conference'
            //rowCollectionOnDone : true,
            //useColumnNames : true,
    }
};
// for admin
router.get('/:id', function(req, res) {
    console.log("get Admin conf");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("select * from [Conference] where [Creator]= @user", function() {
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

router.post('/:id-:Conference_name-:Date-:Start_time-:End_time-:Guest_speaker-:Location-:Organiser-:PlaceAv-:desc-:creator', function(req, res) {
    console.log("in post admin");
    var connection = new Connection(config);
    var results = [];
    var request = req.params;
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            msg = request.Date.toString();
            msg = msg.replace("q","/");
            msg = msg.replace("q","/");
            msg = msg.replace("q","/");
            var sql = "insert into [Conference] values (";
            sql = sql + "'" + request.Conference_name + "','" + msg + "','" + request.Start_time + "','";
            sql = sql + request.End_time + "','" + request.Guest_speaker + "','" + request.Location + "','" + request.Organiser
            sql = sql + "','" + request.desc + "'," + request.PlaceAv + "," + request.creator;
            sql = sql + ")";
            console.log(sql);
            var r = new Request(sql, function() {
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
    });
});
router.put('/:id-:Conference_name-:Date-:Start_time-:End_time-:Guest_speaker-:Location-:Organiser-:PlaceAv-:desc', function(req, res) {
    console.log("is admin");
    var connection = new Connection(config);
    var results = [];
    var request = req.params;
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            msg = request.Date.toString();
            msg = msg.replace("q","/");
            msg = msg.replace("q","/");
            msg = msg.replace("q","/");
            console.log(msg);
            var sql = "Update [Conference] set  ";
            sql = sql + "Conference_name = '" + request.Conference_name + "' , [Date] = ' " + msg + " ',Start_time = ' " + request.Start_time + "', "
            sql = sql + "End_time = '" + request.End_time + "', Guest_speaker = '" + request.Guest_speaker + "', Location = '" + request.Location + "', "
            sql = sql + "Organiser = '" + request.Organiser + "', Description = '" + request.desc + "', [Place_available]= "+ request.PlaceAv + " where conference_id = " + request.id;
            console.log(sql);
            var r = new Request(sql, function() {
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
    });
});

module.exports = router;