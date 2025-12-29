import { useState } from 'react';

function ConditionForm({ patientId, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
        diagnosis: '',
        description: '',
        status: 'ACTIVE',
        severity: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ ...formData, patientId });
    };

    return (
        <form onSubmit={handleSubmit} className="condition-form">
            <h4>Add New Condition</h4>

            <div className="form-group">
                <label>Diagnosis: *</label>
                <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label>Description:</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows="3"
                />
            </div>

            <div className="form-group">
                <label>Status: *</label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                    <option value="ACTIVE">Active</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="RECURRENCE">Recurrence</option>
                </select>
            </div>

            <div className="form-group">
                <label>Severity:</label>
                <input
                    type="text"
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    placeholder="e.g., Mild, Moderate, Severe"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">Save Condition</button>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default ConditionForm;
