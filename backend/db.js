// db.js
const mysql = require('mysql2');

// Create a connection to the database
const connection = mysql.createConnection({
  host: 'martakolejko.atthost24.pl',
  user: '17111_mdon',  // Your MySQL username
  password: 'PQ8rk]eD.6)mr*y',  // Your MySQL password
  database: '17111_mdon'  // Your MySQL database
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ', err);
    return;
  }
  console.log('Connected to MySQL!');
});

module.exports = connection;
