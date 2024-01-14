const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const patientRoutes = require('./routes/patients'); // Stellen Sie sicher, dass der Pfad korrekt ist

const app = express();

// Statische Dateien bereitstellen (CSS, JavaScript, Bilder, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware für das Parsen von JSON-Anfragen
app.use(bodyParser.json());

// Routen
app.get('/', (req, res) => {
    res.send('Willkommen zur Patientenverwaltungs-App');
});

// Verwenden Sie die Patientenrouten
app.use('/patients', patientRoutes);

// Server starten
const PORT = process.env.PORT || 3000; // Port 3000 oder Umgebungsvariable, falls festgelegt
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
