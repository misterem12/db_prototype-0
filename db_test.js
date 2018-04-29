var mysql = require('mysql');

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Mikery1005596",
    database: "dawei_db"
  });
  
//   con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");
//     var sid = '5831072421'
//     con.query('SELECT CONCAT( "[", GROUP_CONCAT(JSON_OBJECT("sid", StudentID, "fname", Fname, "lname", Lname, "degree", Degree, "enroll", EnrollDate )), "]") AS s FROM student WHERE StudentID = ?', [sid], 
//     function(error, results, fields) {
//       console.log("test")  
//       if (error) return { error: error };
//       else {
//         // console.log(results)          
//         results = results.map(result => {
//           result["s"] = JSON.parse(result["s"]);
//         //   console.log(result)
//           return result
//         });
//         console.log(results[0]['s'][0])          
//       }
//     });
//   });
db.connect();
// db.query(
//     // JSON_OBJECT('semester', Semester, 'year', Year, 'status', Status)
//     "SELECT JSON_OBJECT('fee',Fee, 'status',Payment) as ob FROM student",
//     function(error, results, fields) {
//       if (error) return { error: error };
//       else {
//         // results = JSON.parse(results['pay'])
//         var result = JSON.parse(results[0]['ob'])
//         console.log(result)
//       }
//     }   
//   )

var query = "SELECT JSON_OBJECT('cid', CourseID, 'name', Name, 'des', Description, 'crd', Credits, 'pre', Prerequisite, 'sec', SectionNo, 'seats', AvailableSeats,'teacher', Teacher, 'room' , RoomNo, 'build', Building ) AS c FROM CourseList ORDER BY CourseID;"
var courses = []; 
db.query(query,function (error, results, fields) {
  if (error) return { error: error };
  else {
    for( row in results ){
      console.log('row =',row)
      courses.push(JSON.parse(results[row]['c']))
      console.log('pushed')
    }
    console.log("the courses is",courses)
  }
})

