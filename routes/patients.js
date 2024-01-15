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

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await patientModel.deletePatient(id);
        res.status(200).json({ message: 'Patient deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.put('/patient/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { status } = req.body; // Nehmen Sie den Status aus dem Request Body
        await patientModel.updatePatientStatus(id, status);
        res.json({ message: 'Patient status successfully updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
