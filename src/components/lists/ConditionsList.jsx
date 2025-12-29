import StatusBadge from '../common/StatusBadge';

function ConditionsList({ conditions }) {
    if (conditions.length === 0) {
        return <p className="no-data">No conditions recorded for this patient.</p>;
    }

    return (
        <div className="conditions-list">
            {conditions.map((condition) => (
                <div key={condition.id} className="card condition-card">
                    <div className="card-header">
                        <h4>{condition.diagnosis}</h4>
                        <StatusBadge status={condition.status} />
                    </div>

                    {condition.description && (
                        <p className="card-description">{condition.description}</p>
                    )}

                    <div className="card-meta">
                        <span>Severity: {condition.severity || 'Not specified'}</span>
                        <span>Diagnosed: {new Date(condition.diagnosisDate).toLocaleDateString('sv-SE')}</span>
                        {condition.diagnosedByName && (
                            <span>Diagnosed by: {condition.diagnosedByName}</span>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ConditionsList;
