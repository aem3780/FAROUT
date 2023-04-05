var mysql = require('mysql2');

var con = mysql.createConnection({
  host: "cad.rit.edu",
  user: "farout",
  password: "gnmX5dWXwkJ6",
  database: "farout"
});


// con.connect(function(err) {
//     if (err) throw err;
//     var sql = "CREATE DATABASE memories";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Database created");
//     });
//   });

// con.connect(function(err) {
//     if (err) throw err;
//     var sql = "CREATE TABLE memories (memoryID SMALLINT UNSIGNED AUTO_INCREMENT, memoryType ENUM('beautiful', 'proud', 'crazy', 'spooky', 'tasty', 'silly', 'awkward', 'joyful') NOT NULL, memory VARCHAR(300) NOT NULL, submitted VARCHAR(50) NOT NULL DEFAULT '00/00/0000 00:00:00', imagePathLocation VARCHAR(1024), CONSTRAINT PK_memories PRIMARY KEY (memoryID))";
//     con.query(sql, function (err, result) {
//       if (err) throw err;
//       console.log("Table created");
//     });
//   });

  con.connect(function(err) {
    if (err) throw err;
    var sql = "INSERT INTO memories (memoryType, memory, submitted, imagePath) VALUES ?";
    var values = [
      ['tasty', 'Going home to my parents\' cooking after penny pinching and lowkey starving at college. It reminded me there\'s more to food than budgeting and survival.', '2/26/2023 12:41:26'],
      ['spooky', 'When I was like 8 years old I had a dream someone had slashed my neck. I woke up and genuinely thought I was going to bleed out and die. I lived though!', '2/26/2023 12:42:57'],
      ['proud', 'When my dad completed his chemotherapy and beat cancer! ', '2/26/2023 12:45:29'],
      ['proud', 'When I was accepted into New Media Design out of 150 applicants', '2/26/2023 12:51:33'],
      ['beautiful', 'Having a bonfire on the beach with my family during a full moon.', '2/26/2023 13:01:35']
    ];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });

  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT * FROM memories", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    });
  });