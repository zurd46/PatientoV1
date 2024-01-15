const db = require('../config/dbConfig');

async function addPatient(patientData) {
    return new Promise((resolve, reject) => {
        const { name, lastname, age, birthdate, ahv, address, plz, city } = patientData;
        const sql = `INSERT INTO patients (name, lastname, age, birthdate, ahv, address, plz, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.run(sql, [name, lastname, age, birthdate, ahv, address, plz, city], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve({ id: this.lastID, ...patientData });
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
            resolve({ message: 'Patient erfolgreich gelöscht', id: this.lastID });
            }
        });
    });
}

module.exports = {
    addPatient,
    getAllPatients,
    getPatientById,
    deletePatient
};