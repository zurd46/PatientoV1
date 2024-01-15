document.addEventListener('DOMContentLoaded', function () {
    // Function to calculate age from birthdate
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

    // Function to handle form submission
    function handleSubmitPatientForm() {
        const name = document.getElementById('patientName').value;
        const lastname = document.getElementById('patientLastname').value;
        const birthdate = document.getElementById('patientBirthdate').value;
        const age = calculateAge(birthdate);
        const ahv = document.getElementById('patientAHV').value;
        const address = document.getElementById('patientAddress').value;
        const plz = document.getElementById('patientPLZ').value;
        const city = document.getElementById('patientCity').value;

        fetch('/patients', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, lastname, age, birthdate, ahv, address, plz, city })
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

    // Function to fetch and display patients
    function fetchPatients() {
        fetch('/patients')
            .then(response => response.json())
            .then(patients => {
                const patientsContainer = document.getElementById('patientsContainer');
                patientsContainer.innerHTML = '';
                patients.forEach(patient => {
                    // Verwenden Sie formatDate, um das Erstellungsdatum und die Uhrzeit zu formatieren
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

    // Ihre vorhandene formatDate-Funktion
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Function to fill edit form with patient data
    function fillEditFormWithPatientData(patientId) {
        fetch(`/patients/${patientId}`)
            .then(response => response.json())
            .then(patientData => {
                document.getElementById('editPatientId').value = patientId;
                document.getElementById('editPatientName').value = patientData.name;
                document.getElementById('editPatientLastname').value = patientData.lastname;
                // Set the birthdate value correctly
                const birthdate = patientData.birthdate ? new Date(patientData.birthdate).toISOString().split('T')[0] : '';
                document.getElementById('editPatientBirthdate').value = birthdate;
                document.getElementById('editPatientAHV').value = patientData.ahv;
                document.getElementById('editPatientAddress').value = patientData.address;
                document.getElementById('editPatientPLZ').value = patientData.plz;
                document.getElementById('editPatientCity').value = patientData.city;
            })
            .catch(error => console.error('Fehler beim Abrufen der Patientendaten:', error));
    }

    // Function to handle patient deletion
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
            }
            targetElement = targetElement.parentElement;
        }
    
        // Ähnliche Logik für den Löschbutton
        if (event.target && event.target.classList.contains('delete-btn')) {
            const patientId = event.target.getAttribute('data-id');
            handleDeletePatient(patientId);
        }
    });

    // Fetch and display patients when the page loads
    fetchPatients();
});
