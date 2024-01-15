(function() {
    'use strict';

    function PatientStatus() {
        this.initDropdown();
    }

    PatientStatus.prototype.initDropdown = function() {
        const dropdown = `
            <select class="form-control" id="patientStatus">
                <option value="stable">Stable</option>
                <option value="unstable">Unstable</option>
                <option value="not-definable">Not definable</option>
            </select>
        `;

        // Fügen Sie das Dropdown zum Bearbeitungsmodal hinzu
        //const modalBody = document.querySelector('#editPatientModal .modal-body');
        //if (modalBody) {
        //    modalBody.insertAdjacentHTML('beforeend', dropdown);
        //}
    };

    window.PatientStatus = PatientStatus;
})();
