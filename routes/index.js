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

// router.post('/menu', function (req, res, next) {
//   // if (req.cookies.sid != undefined) next();
//   // if(req.body.submit == undefined) next();
//   console.log('logging in')
//   console.log(req.body)
//   var sid = req.body.sid
//   var pass = req.body.pass
//   console.log(sid)
//   console.log(pass)
//   if (sid == null || pass == null) {
//     res.cookie('warning', "Please Fill Your Student ID/Password")
//     console.log(req.cookies.warning)
//     res.redirect('/')
//   }
//   else if (sid.length != 10) {
//     // console.log(sid)
//     res.cookie('warning', "Invalid Student ID/Password")
//     console.log(req.cookies.warning)
//     res.redirect('/')
//   }
//   else {
//     console.log("valid sid")
//     db.query(
//       'SELECT JSON_OBJECT("sid", StudentID, "pass", Password ) AS s FROM password WHERE StudentID = ?', [sid],
//       function (error, results, fields) {
//         if (error) return { error: error };
//         else {
//           console.log(JSON.parse(results[0]['s']).pass,pass,JSON.parse(results[0]['s']).pass == pass)
//           if (JSON.parse(results[0]['s']).pass != pass) {
//             res.cookie('warning', "Invalid Student ID/Password")
//             console.log(req.cookies.warning)
//             res.redirect('/')
//           }
//         }
//       }
//     )
//     console.log("pw valid")
//     res.cookie('sid', sid)
//     console.log(req.cookies.sid)
//     next()
//   }
// });

router.post('/menu', function (req, res, next) {

  // var sid

    console.log('logging in')
    console.log(req.body)
    var sid = req.body.sid
    var pass = req.body.pass
    console.log(sid, pass)
    if (sid.length == 0 || pass.length == 0 || sid == null || pass == null) {
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
            console.log(JSON.parse(results[0]['s']).pass,pass,JSON.parse(results[0]['s']).pass == pass)
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
      console.log(req.cookies)
      next()
    }
});

router.use('/menu', function(req,res,next){
  console.log('login')
  var sid
  if(req.method == 'POST') sid = req.body.sid
  else sid = req.cookies.sid
  console.log("current sid id", sid)
  if(sid == undefined){
    res.cookie('warning', "Please Login First")
    console.log(req.cookies.warning)
    res.redirect('/')
  }
  else{
    db.query(
      'SELECT JSON_OBJECT("sid", StudentID, "fname", Fname, "lname", Lname, "degree", Degree, "enroll", EnrollDate ) AS s FROM student WHERE StudentID = ?', [sid],
      function (error, results, fields) {
        if (error) return { error: error };
        else {
          // console.log(results[0])        
          // console.log(results[0]['s'])
          res.render('menu', { s: JSON.parse(results[0]['s']) })
          console.log('complete')
        }
      })
  }  
})


router.get('/payment', function (req, res, next) {
  console.log(req.cookies.sid)
  db.query(
    "SELECT JSON_OBJECT('fee',Fee, 'status',Payment) as ob FROM student WHERE StudentID = ?", req.cookies.sid,
    function (error, results, fields) {
      if (error) return { error: error };
      else {
        // results = JSON.parse(results['pay'])
        // console.log(JSON.parse(results[0]['ob']))

        var result = JSON.parse(results[0]['ob'])
        // console.log(result)
        res.render('payment', { fee: result.fee, status: result.status })
      }
    }
  )
});

router.get('/course', function(req,res,next){

  var cid = req.query.course
  var sec = req.query.section
  var act = req.query.act

  var sid = req.cookies.sid

  console.log(cid, sec, act);

  if(act == undefined){
    console.log('doing nothing')
  }
  else if(act == 'a'){
    console.log("adding")
    var value = {CourseID: cid, SectionNo: sec, Semester: '2', Year: '2018',StudentID: sid, Grade: 'NA'}
    db.query("INSERT INTO registeredCourse SET ?",value,function (error, results, fields) {
      if (error) return { error: error };
      else {
        console.log("adding complete")
      }
    })
  } 
  else if(act == 'w'){
    console.log('withdrawing')
    db.query("DELETE FROM registeredCourse WHERE CourseID = ? AND SectionNo = ?", [cid, sec] ,function (error, results, fields) {
      if (error) return { error: error };
      else {
        // results = JSON.parse(results['pay'])
        console.log('withdrawing complete')
      }
    })
  } 
  next()
})

router.get('/course', function (req, res, next) {
  console.log('checking registered courses')
  var sid = req.cookies.sid
  var query = "SELECT JSON_OBJECT('cid', CourseID, 'name', Name, 'des', Description, 'crd', Credits, 'sec', SectionNo, 'teacher', Teacher, 'room' , RoomNo, 'build', Building, 'time', Timeslot, 'grade', Grade ) AS c FROM RegList r WHERE r.StudentID = ? ORDER BY CourseID ;"
  var courses = []; 
  console.log('querying')
  db.query(query,[sid],function (error, results, fields) {
    if (error) return { error: error };
    else {
      // results = JSON.parse(results['pay'])
      console.log('processing DB')
      for( row in results ){
        //console.log('row =',row)
        courses.push(JSON.parse(results[row]['c']))
        //console.log('pushed')
      }
      // console.log("the courses is",courses)
      res.render('courselist-w', {title: 'Registered Courses', courses: courses });
    }
  })
});

router.get('/reg', function (req, res, next) {
  var sid = req.cookies.sid
  //c.CourseID, c.Name, c.Description, c.Credits, c.Prerequisite, s.SectionNo, s.AvailableSeats, s.Teacher, s.RoomNo, s.Building
  // var query = "SELECT CONCAT( '[', GROUP_CONCAT(JSON_OBJECT('cid', CourseID, 'name', Name, 'des', Description, 'crd', Credits, 'pre', Prerequisite, 'sec', SectionNo, 'seats', AvailableSeats,'teacher', Teacher, 'room' , RoomNo, 'build', Building )), ']') AS c FROM CourseList"
  var query = "SELECT JSON_OBJECT('cid', CourseID, 'name', Name, 'des', Description, 'crd', Credits, 'pre', Prerequisite, 'sec', SectionNo, 'seats', AvailableSeats,'teacher', Teacher, 'room' , RoomNo, 'build', Building, 'time', Timeslot ) AS c FROM CourseList ORDER BY CourseID;"
  var courses = []; 
  db.query(query,[sid],function (error, results, fields) {
    if (error) return { error: error };
    else {
      // results = JSON.parse(results['pay'])
      for( row in results ){
        //console.log('row =',row)
        courses.push(JSON.parse(results[row]['c']))
        //console.log('pushed')
      }
      // console.log("the courses is",courses)
      res.render('courselist', {title: 'Available Courses', courses: courses });
    }
  })
});

module.exports = router;
