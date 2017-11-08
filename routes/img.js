var express = require("express");
var router = express.Router();
var multer = require('multer');
var app = express();
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

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'C:\\Users\\Stanley\\Documents\\IT 680\\Conference\\public\\Uploads');
    },
    filename: function(req, file, callback) {
        callback(null, file.fieldname + '-' + Date.now());
    }
});
var upload = multer({ storage: storage }).single('userPhoto');

router.post('/', function(req, res) {
    upload(req, res, function(err) {
        if (err) {
            return res.end("Error uploading file.");
        }
        console.log(req.file);
        console.log(req.body.first);

//the update
var connection = new Connection(config);
    var results = [];
    connection.on('connect', function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log('connected!');
            console.log(req.params.lname);
            var sql = "UPDATE [dbo].[Participant] SET ";
            sql = sql + "  [Fname] = '" + req.body.first + "', ";
            sql = sql + "  [Lname] = '" + req.body.last + "', ";
            sql = sql + "  [Email] = '" + req.body.email + "', ";
            sql = sql + "  [Img] = '" + req.file.filename + "', ";
            sql = sql + "  [Password] = '" + req.body.Password[0] + "' ";
            //sql = sql + "  [Username] = '" + req.params.fname + "' ";
            sql = sql + "   where [Participant_id] = " + req.body.id;
            console.log(sql);
            var r = new Request(sql, function() {
                res.send(req.params.img);
            });

            connection.execSql(r);
        }
    });

        var string = encodeURIComponent('something that would break');
        res.redirect('/');
    });
});


module.exports = router;