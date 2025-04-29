const express = require('express');
const path = require('path');
const connectDB = require('./db');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to the database
connectDB();

// Middleware to parse JSON data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a schema and model for the "teacher" collection
const teacherSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  date_de_naissance: Date,
  sexe: String,
  etablissement: String,
  filiere: String,
  typeetulisateur: String,
  email: String,
  password: String,
}, { collection: 'teacher' });
const Teacher = mongoose.model('Teacher', teacherSchema);

// Define a schema and model for the "Etudiant" collection
const studentSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  date_de_naissance: Date,
  sexe: String,
  etablissement: String,
  filiere: String,
  typeetulisateur: String,
  email: String,
  password: String,
}, { collection: 'Etudiant' });
const Student = mongoose.model('Student', studentSchema);

// Serve static files from "project" folder
app.use(express.static(path.join(__dirname, 'project')));

// Default route to serve login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'project', 'login.html'));
});

// Route to fetch and display documents from the "teacher" collection
app.get('/teachers', async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST route to handle form submissions
app.post('/submit-form', async (req, res) => {
  try {
    const { typeetulisateur, ...formData } = req.body;

    if (typeetulisateur === 'Enseignant') {
      const teacherData = new Teacher({ ...formData, typeetulisateur });
      await teacherData.save(); // Save to the "teacher" collection
      console.log('Form data saved to teacher collection:', req.body);
    } else if (typeetulisateur === 'Etudiant') {
      const studentData = new Student({ ...formData, typeetulisateur });
      await studentData.save(); // Save to the "Etudiant" collection
      console.log('Form data saved to Etudiant collection:', req.body);
    }

    res.send('lma3lomat dfiyalek weslona chokran !');
  } catch (err) {
    console.error('kayen mochkil:', err.message);
    res.status(500).send('Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});