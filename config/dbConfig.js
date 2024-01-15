const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./patient_db.sqlite', (err) => {
    if (err) {
        console.error(err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS patients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT, 
            lastname TEXT,
            age INTEGER, 
            birthdate TEXT,
            ahv TEXT,
            address TEXT,
            plz INTEGER,
            city TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            status TEXT, 
            status_updated_at DATETIME
        )`);
    }
});

module.exports = db;
