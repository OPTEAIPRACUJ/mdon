var http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use hosting platform’s port or default to 3000

const cors = require('cors');
const db = require('./db');

const jwtSecret = 'kVH62lImcXLQ5bZJE2QDTsWKwwObAmzJ';

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer token' format
  if (!token || token !== jwtSecret) return res.sendStatus(401); // Unauthorized

  else next();
};

// READ - Get all users
app.get('/registration_data', verifyToken, (req, res) => {
  const searchPhrase = req.query.search; // Get the search phrase from the query parameter

  let sql = 'SELECT * FROM registration_data WHERE ';
  let params = [];

  // Build the WHERE clause dynamically based on the search phrase
  if (searchPhrase) {
    const searchConditions = [];
    searchConditions.push('fullName LIKE ?');
    searchConditions.push('company LIKE ?');
    searchConditions.push('email LIKE ?');
    searchConditions.push('phone LIKE ?');

    sql += searchConditions.join(' OR ');
    params.push(`%${searchPhrase}%`, `%${searchPhrase}%`, `%${searchPhrase}%`, `%${searchPhrase}%`);
  } else {
    // If no search phrase is provided, return all records
    sql += '1=1';
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

app.get('/registration_data/count', verifyToken, (req, res) => {
  const sql = 'SELECT COUNT(*) AS total_count FROM registration_data';

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results[0]); // Access the first element containing the total count
  });
});

// CREATE - Add a new user
app.post('/registration_data', verifyToken, (req, res) => {
  const { fullName, company, email, phone, amountOfParticipants, potwierdzenieZgod, zgodyUzytkownika } = req.body;

  // Validate input data here (e.g., check for required fields, data types)

  const query = 'INSERT INTO registration_data (fullName, company, email, phone, amountOfParticipants, potwierdzenieZgod, przetwarzanieDanych, otrzymywanieInformacji, wykorzystanieWizerunku, informacjeMarketingowe, kontaktTelefoniczny) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [fullName, company, email, phone, amountOfParticipants, potwierdzenieZgod, zgodyUzytkownika.przetwarzanieDanych, zgodyUzytkownika.otrzymywanieInformacji, zgodyUzytkownika.wykorzystanieWizerunku, zgodyUzytkownika.informacjeMarketingowe, zgodyUzytkownika.kontaktTelefoniczny];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.status(201).json({ message: 'Registration data added successfully', id: result.insertId });
  });
});

// DELETE an item by id
app.delete('/registration_data/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM registration_data WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }
    res.sendStatus(204); // No content
  });
});

app.get('/patrons', verifyToken, (req, res) => {
  const patronType = req.query.patron_type;

  let sql = 'SELECT * FROM patrons';

  if (patronType) {
    sql += ' WHERE patron_type = ?';
  }

  db.query(sql, [patronType], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
  });
});

/*
To fetch all images:
  http://your-api-endpoint/patrons

To fetch images with the patron_type "medialny":
  http://your-api-endpoint/patrons?patron_type=medialny
*/

// Start the server
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
