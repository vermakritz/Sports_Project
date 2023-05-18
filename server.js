const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

//to use varibale passed from forms in index.html
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Serve static files from the "public" directory
app.use(express.static(__dirname));

// MySQL database configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Rishabh@123',
  database: 'student'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

//root route
app.get('/', (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Set up the route to handle form submissions
app.post('/submit', (req, res) => {

  const rollNumber = req.body.rollNumber;
  // Perform the query
  connection.query(`SELECT student.*,
    CONCAT_WS(', ',
            CASE WHEN games.Volleyball = 'Y' THEN 'Volleyball' ELSE NULL END,
            CASE WHEN games.Football = 'Y' THEN 'Football' ELSE NULL END,
            CASE WHEN games.cricket = 'Y' THEN 'Cricket' ELSE NULL END,
            CASE WHEN games.tabletennis = 'Y' THEN 'Table Tennis' ELSE NULL END,
            CASE WHEN games.badminton = 'Y' THEN 'Badminton' ELSE NULL END,
            CASE WHEN games.Chess = 'Y' THEN 'Chess' ELSE NULL END
            
            ) AS ParticipatedGames
  FROM student
  INNER JOIN games ON student.ID = games.s_id
  WHERE student.ID = ?;`, [rollNumber] ,(err, results) => {
    // If there is an error in executing query give error
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {

      // Else Process the query results
      const queryResult = JSON.stringify(results);

      // Redirect to the desired route with the response data
      res.redirect('/details.html?data=' + encodeURIComponent(queryResult));
    }
  });
});

// code to get click from URl and execute 2nd SQL command
// Handle POST request to /execute-query route
app.post('/execute-query', (req, res) => {

  const game = req.body.game;
  // Perform the query
  let query = "";
  if(game == 'volleyball'){
    query = "SELECT student.* FROM student INNER JOIN games ON student.ID = games.S_ID WHERE games.volleyball = 'Y' ;";
  }
 
  else if(game == 'football'){
    query = "SELECT student.* FROM student INNER JOIN games ON student.ID = games.S_ID WHERE games.football = 'Y' ;";
  }

  else if(game == 'cricket'){
    query = "SELECT student.* FROM student INNER JOIN games ON student.ID = games.S_ID WHERE games.cricket = 'Y' ;";
  }

  else if(game == 'badminton'){
    query = "SELECT student.* FROM student INNER JOIN games ON student.ID = games.S_ID WHERE games.badminton = 'Y' ;";
  }

  else if(game == 'tabletennis'){
    query = "SELECT student.* FROM student INNER JOIN games ON student.ID = games.S_ID WHERE games.tabletennis = 'Y' ;";
  }

  else if(game == 'chess'){
    query = "SELECT student.* FROM student INNER JOIN games ON student.ID = games.S_ID WHERE games.chess = 'Y' ;";
  }

  //Execute query
  connection.query(query,(err, results) => {
    // If there is an error in executing query give error
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {

      // Else Process the query results
      const queryResult = JSON.stringify(results);

      // Redirect to the desired route with the response data
      res.redirect('/teams.html?data=' + encodeURIComponent(queryResult));
    }
});

});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});