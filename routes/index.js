var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cookieParser = require('cookie-parser')

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mikery1005596",
    database: "dawei_db"
  });
  
db.connect()

router.use(cookieParser())

/* GET home page. */
router.get('/', function(req, res, next) {
  res.cookie('warning',null)
  res.render('login',{warning: req.cookies.warning});

});

router.get('/menu', function(req, res, next) {
  var sid = req.query["sid"]
  // console.log(sid.length)
  if(sid.length != 10){
    res.cookie('warning','Invalid Student ID')
    res.redirect('/')
  }
  else{

    db.query(
    'SELECT JSON_OBJECT("sid", StudentID, "fname", Fname, "lname", Lname, "degree", Degree, "enroll", EnrollDate ) AS s FROM student WHERE StudentID = ?', [sid], 
    function(error, results, fields) {
      if (error) return { error: error };
      else {
        console.log(results[0]['s'])
        res.render('menu',{s : JSON.parse(results[0]['s'])})
        router.get('/payment', function(req, res, next){
          db.query(
            "SELECT JSON_OBJECT('fee',Fee, 'status',Payment) as ob FROM student WHERE StudentID = ?",[sid],
            function(error, results, fields) {
              if (error) return { error: error };
              else {
                // results = JSON.parse(results['pay'])
                var result = JSON.parse(results[0]['ob'])
                console.log(result)
                res.render('payment',{fee : result.fee, status : result.status, sid : sid})
              }
            }  
          )
        });
      }
    }
  )};  
});



module.exports = router;
