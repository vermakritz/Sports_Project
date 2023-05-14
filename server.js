const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// MySQL database configuration
const connection = mysql.createConnection({
  host: 'your_host',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database'
});

// Connect to the MySQL database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Set up the route to handle form submissions
app.get('/students', (req, res) => {
  const rollNumber = req.query.rollNumber;

  // Perform the query
  connection.query('SELECT * FROM students WHERE rollNumber = ?', [rollNumber], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error executing query');
    } else {
      // Process the query results
      const student = results[0];
      res.send(student);
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
