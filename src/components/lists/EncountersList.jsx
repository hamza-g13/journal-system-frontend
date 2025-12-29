
function EncountersList({ encounters }) {
    if (encounters.length === 0) {
        return <p className="no-data">No encounters recorded for this patient.</p>;
    }

    return (
        <div className="encounters-list">
            {encounters.map(encounter => (
                <div key={encounter.id} className="card encounter-card">
                    <div className="card-header">
                        <h4>{encounter.type.replace('_', ' ')}</h4>
                        <span className="date-badge">
                            {new Date(encounter.encounterDate).toLocaleDateString()}
                        </span>
                    </div>
                    <div className="encounter-details">
                        <p><strong>Practitioner:</strong> {encounter.practitionerName}</p>
                        <p><strong>Reason:</strong> {encounter.reasonForVisit}</p>
                        {encounter.notes && (
                            <p><strong>Notes:</strong> {encounter.notes}</p>
                        )}
                        {encounter.location && (
                            <p><strong>Location:</strong> {encounter.location.name}, {encounter.location.city}</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default EncountersList;
