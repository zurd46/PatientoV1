const express = require('express');
const router = express.Router();
const patientModel = require('../models/patientModel'); // Stellen Sie sicher, dass der Pfad korrekt ist

router.get('/', async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients(); // Hier wird die Funktion aufgerufen
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newPatient = await patientModel.addPatient(req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
