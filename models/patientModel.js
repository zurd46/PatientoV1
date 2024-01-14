const db = require('../config/dbConfig');

async function addPatient(patientData) {
    return new Promise((resolve, reject) => {
        const { name, lastname, age, address, plz, city } = patientData;
        const sql = `INSERT INTO patients (name, lastname, age, address, plz, city) VALUES (?, ?, ?, ?, ?, ?)`;
        db.run(sql, [name, lastname, age, address, plz, city], function (err) {
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

module.exports = {
    addPatient,
    getAllPatients
};
