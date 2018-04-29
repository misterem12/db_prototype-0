var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mikery1005596",
  database: "dawei_db"
});

db.connect()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.cookie('warning', " ")
  res.render('login', { warning: req.cookies.warning });
});

router.get('/schedule', function (req, res, next) {
  res.render('schedule', {
    mon: [["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi", "Data", "Tada", "EZ1"]
      , ["BABAB", "Volvo55", "Saab55", "Ford", "Fiat", "Audi", "Data", "Tada", "EZ2"]
      , ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi", "Data", "Tada", "EZ3"]
      , ["BMW", "Volvo", "Saab", "Ford", "Fiat", "Audi", "Data", "Tada", "EZ4"]]
  });
});

router.get('/course', function (req, res, next) {
  res.render('courselist', {});
});

router.post('/menu', function (req, res, next) {
  // if (req.cookies.sid != undefined) next();
  if(req.body.submit == undefined) next();
  console.log('logging in')
  console.log(req.body)
  var sid = req.body.sid
  var pass = req.body.pass
  console.log(sid)
  console.log(pass)
  if (sid == null || pass == null) {
    res.cookie('warning', "Please Fill Your Student ID/Password")
    console.log(req.cookies.warning)
    res.redirect('/')
  }
  else if (sid.length != 10) {
    // console.log(sid)
    res.cookie('warning', "Invalid Student ID/Password")
    console.log(req.cookies.warning)
    res.redirect('/')
  }
  else {
    console.log("valid sid")
    db.query(
      'SELECT JSON_OBJECT("sid", StudentID, "pass", Password ) AS s FROM password WHERE StudentID = ?', [sid],
      function (error, results, fields) {
        if (error) return { error: error };
        else {
          if (JSON.parse(results[0]['s']).pass != pass) {
            res.cookie('warning', "Invalid Student ID/Password")
            console.log(req.cookies.warning)
            res.redirect('/')
          }
        }
      }
    )
    console.log("pw valid")
    res.cookie('sid', sid)
    console.log(req.cookies.sid)
    next()
  }
});

router.use('/menu', function (req, res, next) {
  console.log('login')
  var sid = req.cookies.sid
  db.query(
    'SELECT JSON_OBJECT("sid", StudentID, "fname", Fname, "lname", Lname, "degree", Degree, "enroll", EnrollDate ) AS s FROM student WHERE StudentID = ?', [sid],
    function (error, results, fields) {
      if (error) return { error: error };
      else {
        console.log(results[0]['s'])
        res.render('menu', { s: JSON.parse(results[0]['s']) })
        console.log('complete')
      }
    })
});


router.get('/payment', function (req, res, next) {
  console.log(req.cookies.sid)
  db.query(
    "SELECT JSON_OBJECT('fee',Fee, 'status',Payment) as ob FROM student WHERE StudentID = ?", [req.cookies.sid],
    function (error, results, fields) {
      if (error) return { error: error };
      else {
        // results = JSON.parse(results['pay'])
        console.log(JSON.parse(results[0]['ob']))

        var result = JSON.parse(results[0]['ob'])
        console.log(result)
        res.render('payment', { fee: result.fee, status: result.status })
      }
    }
  )
});


module.exports = router;
