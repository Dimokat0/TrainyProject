const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');
const { initDb } = require('./db');
const { registerUser, loginUser, authenticate, authorize } = require('./auth');
const { Pool } = require('pg');

let db_properties = fs.readFileSync('db_properties.json', 'utf-8');
db_properties = JSON.parse(db_properties);
const pool = new Pool(db_properties);

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

initDb();

// Default pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/users', async (req, res) =>{
  res.sendFile(path.join(__dirname, 'public', 'manage_users.html'));
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  await registerUser(username, password);
  res.send('Register success');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const result = await loginUser(username, password);
  if (result.success) {
    res.json({ accessToken: result.accessToken, refreshToken: result.refreshToken });
  } else {
    res.send(result.message);
  }
});

// Admin panel
app.get('/usr', async (req, res) => {
  const result = await pool.query('SELECT * FROM users');
  res.json(result.rows);
});

  app.get('/roles', async (req, res) => {
  const result = await pool.query('SELECT * FROM roles');
  res.json(result.rows);
});
 
app.post('/usr', async (req, res) => {
  console.log(req.body); // Doesn't get request details from js post
  const { username, password, roleId } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query(
  'INSERT INTO users (username, password, role_id) VALUES ($1, $2, $3)',
  [username, hashedPassword, roleId]
  );

  res.send('User created');
});
  
  app.put('/usr/:id', async (req, res) => { // Also doesn't get required data, except user id
  const { id } = req.params;
  const { username, password, roleId } = req.body;
  
  let query = 'UPDATE users SET ';
  const values = [];
  
  if (username) {
    query += 'username = $' + (values.length + 1) + ', ';
    values.push(username);
  }
  
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    query += 'password = $' + (values.length + 1) + ', ';
    values.push(hashedPassword);
  }
  
  if (roleId) {
    query += 'role_id = $' + (values.length + 1) + ', ';
    values.push(roleId);
  }
  
  query = query.slice(0, -2);
  query += ' WHERE id = $' + (values.length + 1);
  values.push(id);
  
  await pool.query(query, values);
  
  res.send('User updated');
});
  
app.delete('/usr/:id', async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM users WHERE id = $1', [id]);
  res.send('User deleted');
});
 
 // Start listening
app.listen(3000, () => {
  console.log('Server listening on port http://localhost:3000');
});