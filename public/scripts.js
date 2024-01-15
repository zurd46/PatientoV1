document.addEventListener('DOMContentLoaded', function () {
    // Funktion zur Berechnung des Alters aus dem Geburtsdatum
    function calculateAge(birthdate) {
        const birthDate = new Date(birthdate);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDifference = today.getMonth() - birthDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Funktion zur Verarbeitung der Formularübermittlung
    function handleSubmitPatientForm() {
        const name = document.getElementById('patientName').value;
        const lastname = document.getElementById('patientLastname').value;
        const birthdate = document.getElementById('patientBirthdate').value;
        const age = calculateAge(birthdate);
        const ahv = document.getElementById('patientAHV').value;
        const address = document.getElementById('patientAddress').value;
        const plz = document.getElementById('patientPLZ').value;
        const city = document.getElementById('patientCity').value;
        //const status = document.getElementById('patientStatus').value; // Ausgewählter Status

        fetch('/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lastname, age, birthdate, ahv, address, plz, city, status })
        })
            .then(response => response.json())
            .then(data => {
                $('#patientModal').modal('hide');
                document.getElementById('patientForm').reset();
                fetchPatients();
            })
            .catch((error) => {
                console.error('Fehler:', error);
            });
    }

    // Funktion zum Abrufen und Anzeigen von Patienten
    function fetchPatients() {
        fetch('/patients')
            .then(response => response.json())
            .then(patients => {
                const patientsContainer = document.getElementById('patientsContainer');
                patientsContainer.innerHTML = '';
                patients.forEach(patient => {
                    const createdDate = patient.created_at ? formatDate(patient.created_at) : 'No Date';
                    const patientCard = `
                    <div class="col-md-4 mb-3">
                        <div class="card text-dark">
                            <div class="card-body">
                                <h5 class="card-title">${patient.name} ${patient.lastname}</h5>
                                <p class="card-text">Age: ${patient.age}</p>
                                <p class="card-text">AHV: ${patient.ahv}</p>
                                <p class="card-text"><small class="text-muted">Created on: ${createdDate}</small></p>
                                <button class="edit-btn btn btn-secondary btn-sm" data-id="${patient.id}"><i class="fas fa-pencil-alt"></i></button>
                                <button class="delete-btn btn btn-danger btn-sm" data-id="${patient.id}"><i class="fas fa-trash-alt"></i></button>
                            </div>  
                        </div>
                    </div>`;
                    patientsContainer.innerHTML += patientCard;
                });
            })
            .catch(error => console.error('Error:', error));
    }

    // Funktion zum Formatieren von Datumsangaben
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Funktion zum Ausfüllen des Bearbeitungsformulars mit Patientendaten
    function fillEditFormWithPatientData(patientId) {
        fetch(`/patients/${patientId}`)
            .then(response => response.json())
            .then(patientData => {
                // Überprüfen, ob jedes Element existiert, bevor Sie versuchen, seinen Wert zu setzen
                const editPatientIdElem = document.getElementById('editPatientId');
                if (editPatientIdElem) editPatientIdElem.value = patientId;
    
                const editPatientNameElem = document.getElementById('editPatientName');
                if (editPatientNameElem) editPatientNameElem.value = patientData.name;
    
                const editPatientLastnameElem = document.getElementById('editPatientLastname');
                if (editPatientLastnameElem) editPatientLastnameElem.value = patientData.lastname;
    
                const editPatientBirthdateElem = document.getElementById('editPatientBirthdate');
                if (editPatientBirthdateElem) editPatientBirthdateElem.value = patientData.birthdate ? new Date(patientData.birthdate).toISOString().split('T')[0] : '';
    
                const editPatientAHVElem = document.getElementById('editPatientAHV');
                if (editPatientAHVElem) editPatientAHVElem.value = patientData.ahv;
    
                const editPatientAddressElem = document.getElementById('editPatientAddress');
                if (editPatientAddressElem) editPatientAddressElem.value = patientData.address;

                const editPatientPLZElem = document.getElementById('editPatientPLZ');
                if (editPatientPLZElem) editPatientPLZElem.value = patientData.plz;
        
                const editPatientCityElem = document.getElementById('editPatientCity');
                if (editPatientCityElem) editPatientCityElem.value = patientData.city;
        
                const editPatientStatusElem = document.getElementById('editPatientStatus');
                if (editPatientStatusElem) editPatientStatusElem.value = patientData.status ? patientData.status : '';
            })
            .catch(error => console.error('Fehler beim Abrufen der Patientendaten:', error));
        }
    
    // Funktion zur Behandlung der Patientenlöschung
    function handleDeletePatient(patientId) {
        if (confirm('Are you sure you want to delete this patient?')) {
            fetch(`/patients/${patientId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error when deleting the patient');
                    }
                    return response.json();
                })
                .then(() => {
                    alert('Patient successfully deleted');
                    fetchPatients();
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    }

    // Event listener for patient form submission
    document.getElementById('patientForm').addEventListener('submit', function (event) {
        event.preventDefault();
        handleSubmitPatientForm();
    });

    // Event listener for clicking on edit and delete buttons
    document.addEventListener('click', function (event) {
        let targetElement = event.target;

        // Gehe durch die übergeordneten Elemente bis zum Dokumenten-Wurzelelement
        while (targetElement != null) {
            if (targetElement.classList.contains('edit-btn')) {
                // Die ID des Patienten aus dem data-id Attribut des Buttons holen
                const patientId = targetElement.getAttribute('data-id');
                fillEditFormWithPatientData(patientId);
                $('#editPatientModal').modal('show');
                break; // Beendet die Schleife, nachdem das richtige Element gefunden wurde
            } else if (targetElement.classList.contains('delete-btn')) {
                // Die ID des Patienten aus dem data-id Attribut des Buttons holen
                const patientId = targetElement.getAttribute('data-id');
                handleDeletePatient(patientId);
                break; // Beendet die Schleife, nachdem das richtige Element gefunden wurde
            }
            targetElement = targetElement.parentElement;
        }
    });

    // Fetch and display patients when the page loads
    fetchPatients();
});

function handleSubmitEditForm() {
    const patientId = document.getElementById('editPatientId').value;
    const updatedStatus = document.getElementById('editPatientStatus').value;

    fetch(`/patients/${patientId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updatedStatus })
    })
    .then(response => response.json())
    .then(data => {
        $('#editPatientModal').modal('hide');
        fetchPatients(); // Diese Funktion sollte die aktualisierten Patientendaten abrufen
    })
    .catch(error => {
        console.error('Error:', error);
    });
}