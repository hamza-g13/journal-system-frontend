
function PatientsList({ patients, selectedPatient, onPatientSelect, loading }) {
    if (loading) {
        return <p className="list-message">Loading patients...</p>;
    }

    if (patients.length === 0) {
        return <p className="list-message">No patients found</p>;
    }

    return (
        <div className="patients-list">
            {patients.map(patient => (
                <div
                    key={patient.id}
                    className={`patient-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                    onClick={() => onPatientSelect(patient)}
                >
                    <strong>{patient.firstName} {patient.lastName}</strong>
                    <span>SSN: {patient.socialSecurityNumber}</span>
                </div>
            ))}
        </div>
    );
}

export default PatientsList;
