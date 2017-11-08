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

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("here");
    res.send('respond with a resource');
});

router.get('/:username-:password', function(req, res) {
    console.log("not admin");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            var r = new Request("select * from [Participant] where [username]= @username and [password] = @password", function() {
                //res.set({ 'Expires' : new Date(Date.now() + 900000) })
                console.log(results)
                res.send(results);
            });
            r.addParameter('username', TYPES.VarChar, req.params.username);
            r.addParameter('password', TYPES.VarChar, req.params.password);
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

router.post('/:fname-:lname-:email-:password-:username', function(req, res) {
    console.log("in post");
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
           // console.log(req.params.password);
            var username = req.params.email; 
            var sql = "INSERT INTO [dbo].[Participant] ([Fname],[Lname],[Email],[Password],[Username],[IsAdmin]) VALUES";
            sql = sql + "( '" + req.params.fname + "' , '" + req.params.lname + "' , '" + req.params.email; 
            sql = sql + "' ,' " + req.params.password +  "' , '" + username ;
            sql = sql + "', 0)";
            

            var r = new Request(sql, function() {
                var request = new Request("select * from [Participant] where [Username]= @username and [Fname] = @fname  ", function() {
                console.log(results);
                res.send(results);
            });
            console.log(username);
            request.addParameter('username', TYPES.VarChar, username);
            request.addParameter('fname', TYPES.VarChar, req.params.fname);
            request.on("row", function(row) {
                var rowdata = new Object();
                row.forEach(function(column) {
                    rowdata[column.metadata.colName] = column.value;
                });
                results.push(rowdata);
            });
          connection.execSql(request);
            });
           // r.addParameter('Fname', TYPES.VarChar, req.params.fname);
            r.addParameter('Lname', TYPES.VarChar, req.params.lname);
            r.addParameter('Email', TYPES.VarChar, req.params.email);
            r.addParameter('Fname', TYPES.VarChar, req.params.fname);
            r.addParameter('Password', TYPES.VarChar, req.params.password);
            r.addParameter('Username', TYPES.VarChar, req.params.username);

          connection.execSql(r);
        }
    });
});
router.put('/:fname-:lname-:email-:password-:id', function(req, res) {
    console.log(req.params.img);
    var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            console.log(req.params.lname);
            var sql = "UPDATE [dbo].[Participant] SET ";
            sql = sql + "  [Fname] = '" + req.params.fname + "', ";
            sql = sql + "  [Lname] = '" + req.params.lname + "', ";
            sql = sql + "  [Email] = '" + req.params.email + "', ";
            //sql = sql + "  [Img] = '" + req.params.img + "', ";
            sql = sql + "  [Password] = '" + req.params.password + "', ";
            sql = sql + "  [Username] = '" + req.params.fname + "' ";
            sql = sql + "   where [Participant_id] = " + req.params.id;
            console.log(sql);
            var r = new Request(sql, function() {
                res.send(req.params.img);
            });

            connection.execSql(r);
        }
    });
});

module.exports = router;