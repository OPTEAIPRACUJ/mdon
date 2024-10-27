var http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000; // Use hosting platform’s port or default to 3000
const jwt = require('jsonwebtoken');

const cors = require('cors');
const db = require('./db');

const jwtSecret = 'kVH62lImcXLQ5bZJE2QDTsWKwwObAmzJ';

app.use(cors());
app.use(express.json());

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer token' format
  if (!token) return res.sendStatus(401); // Unauthorized

  else next();
  //   jwt.verify(token, jwtSecret, (err, decoded) => {
  // if (err) return res.sendStatus(403); // Forbidden
  // req.user = decoded; // Attach decoded user data to the request object
  //     next(); // Proceed if token is valid
  //   });
};

// READ - Get all users
app.get('/registration_data', verifyToken, (req, res) => {
  db.query('SELECT * FROM registration_data', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database query failed' });
    }
    res.json(results);
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

// Start the server
const server = http.createServer(app)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
