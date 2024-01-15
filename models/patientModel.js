const db = require('../config/dbConfig');

async function addPatient(patientData) {
    return new Promise((resolve, reject) => {
        const { name, lastname, age, birthdate, ahv, address, plz, city, status } = patientData;
        // Fügen Sie den Status und den Timestamp hinzu
        const statusUpdatedAt = new Date().toISOString(); // Aktueller Timestamp
        const sql = `INSERT INTO patients (name, lastname, age, birthdate, ahv, address, plz, city, status, status_updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [name, lastname, age, birthdate, ahv, address, plz, city, status, statusUpdatedAt], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, ...patientData, statusUpdatedAt });
            }
        });
    });
}

async function getAllPatients() {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM patients';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

async function getPatientById(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM patients WHERE id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

async function deletePatient(id) {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM patients WHERE id = ?';
        db.run(sql, [id], function (err) {
            if(err) {
                reject(err);
                } else {
            resolve({ message: 'Patient successfully deleted', id: this.lastID });
            }
        });
    });
}

async function updatePatientStatus(id, status) {
    return new Promise((resolve, reject) => {
        // Aktueller Zeitstempel im ISO-Format
        const statusUpdatedAt = new Date().toISOString();

        // SQL-Anweisung zur Aktualisierung des Status und des Zeitstempels
        const sql = `UPDATE patients SET status = ?, status_updated_at = ? WHERE id = ?`;

        // Ausführen der SQL-Anweisung
        db.run(sql, [status, statusUpdatedAt, id], function (err) {
            if (err) {
                // Bei einem Fehler wird der Fehler zurückgegeben
                reject(err);
            } else {
                // Bei Erfolg wird eine Erfolgsmeldung zusammen mit den aktualisierten Daten zurückgegeben
                resolve({ 
                    message: 'Patient status successfully updated',
                    id: id,
                    status: status,
                    statusUpdatedAt: statusUpdatedAt 
                });
            }
        });
    });
}

module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    deletePatient,
    updatePatientStatus
};