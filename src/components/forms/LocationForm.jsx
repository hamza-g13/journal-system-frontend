import { useState } from 'react';
import { apiFetch } from '../../api/client';


function LocationForm({ onSubmit, onCancel, token }) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        postalCode: '',
        country: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const created = await apiFetch('/locations', {
                method: 'POST',
                body: JSON.stringify(formData)
            }, token);
            onSubmit(created.id);
            setFormData({
                name: '',
                address: '',
                city: '',
                postalCode: '',
                country: ''
            });
        } catch (error) {
            alert('Error creating location: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-location-form">
            <h5>Create New Location</h5>

            <div className="form-group">
                <label>Name: *</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>City:</label>
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Postal Code:</label>
                    <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Address:</label>
                <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                />
            </div>

            <div className="form-group">
                <label>Country:</label>
                <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                />
            </div>

            <div className="form-actions">
                <button
                    type="button"
                    onClick={handleSubmit}
                    className="btn-primary"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : '💾 Save Location'}
                </button>
                <button type="button" onClick={onCancel} className="btn-secondary">
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default LocationForm;
