const express = require('express');
const router = express.Router();
const patientModel = require('../models/patientModel'); // Überprüfen Sie den Pfad

// Route zum Abrufen aller Patienten
router.get('/', async (req, res) => {
    try {
        const patients = await patientModel.getAllPatients();
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route zum Hinzufügen eines neuen Patienten
router.post('/', async (req, res) => {
    try {
        const newPatient = await patientModel.addPatient(req.body);
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route zum Abrufen eines Patienten nach ID
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const patient = await patientModel.getPatientById(id);
        if (patient) {
            res.json(patient);
        } else {
            res.status(404).send('Patient not found');
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route zum Löschen eines Patienten
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await patientModel.deletePatient(id);
        res.status(200).json({ message: 'Patient deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route zum Aktualisieren des Status eines Patienten
router.put('/:id/status', async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body;
        const result = await patientModel.updatePatientStatus(id, status);
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
