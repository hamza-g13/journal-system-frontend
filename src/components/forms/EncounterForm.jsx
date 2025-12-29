import { useState } from 'react';
import LocationForm from './LocationForm';


function EncounterForm({
                           patientId,
                           practitioner,
                           locations,
                           onSubmit,
                           onCancel,
                           onLocationCreated,
                           token
                       }) {
    const [formData, setFormData] = useState({
        locationId: '',
        type: 'CONSULTATION',
        notes: '',
        reasonForVisit: ''
    });
    const [showLocationForm, setShowLocationForm] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            patientId,
            practitionerId: practitioner.id,
            locationId: formData.locationId ? parseInt(formData.locationId) : null
        });
    };

    const handleLocationCreated = (locationId) => {
        setFormData({...formData, locationId: locationId.toString()});
        setShowLocationForm(false);
        onLocationCreated();
    };

    return (
        <form onSubmit={handleSubmit} className="encounter-form">
            <h4>Create New Encounter</h4>

            {practitioner && (
                <div className="info-box">
                    <p>
                        <strong>Practitioner:</strong> Dr. {practitioner.firstName} {practitioner.lastName}
                    </p>
                </div>
            )}

            <div className="form-group">
                <label>Location:</label>
                <div className="location-selector">
                    <select
                        value={formData.locationId}
                        onChange={(e) => setFormData({...formData, locationId: e.target.value})}
                        disabled={showLocationForm}
                    >
                        <option value="">Select location (optional)</option>
                        {locations.map(loc => (
                            <option key={loc.id} value={loc.id}>
                                {loc.name} - {loc.city}
                            </option>
                        ))}
                    </select>
                    <button
                        type="button"
                        className="btn-new-location"
                        onClick={() => setShowLocationForm(!showLocationForm)}
                    >
                        {showLocationForm ? '✕' : '+ New'}
                    </button>
                </div>
            </div>

            {showLocationForm && (
                <LocationForm
                    token={token}
                    onSubmit={handleLocationCreated}
                    onCancel={() => setShowLocationForm(false)}
                />
            )}

            <div className="form-group">
                <label>Type: *</label>
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                >
                    <option value="CONSULTATION">Consultation</option>
                    <option value="EMERGENCY">Emergency</option>
                    <option value="FOLLOW_UP">Follow-up</option>
                    <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                    <option value="SURGERY">Surgery</option>
                </select>
            </div>

            <div className="form-group">
                <label>Reason for Visit: *</label>
                <input
                    type="text"
                    value={formData.reasonForVisit}
                    onChange={(e) => setFormData({...formData, reasonForVisit: e.target.value})}
                    required
                />
            </div>

            <div className="form-group">
                <label>Notes:</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows="3"
                    placeholder="Additional notes about the encounter"
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="btn-primary">Create Encounter</button>
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default EncounterForm;
