import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './CreateProfilePage.css'; // Assume css exists or use inline

const CreateProfilePage = ({ onProfileCreated }) => {
    const { userRole, userId, token } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        socialSecurityNumber: '',
        // Practitioner fields
        type: 'DOCTOR', // or NURSE etc.
        // Patient fields
        phoneNumber: '',
        dateOfBirth: ''
    });
    const [error, setError] = useState(null);

    const isPatient = userRole === 'patient';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const endpoint = isPatient ? '/api/patients' : '/api/practitioners';

        // Prepare payload
        const payload = {
            ...formData,
            userId: userId // The Keycloak UUID
            // email will potentially come from Keycloak profile if needed
        };

        // Map fields based on entity requirements
        // Assuming Patient entity: firstName, lastName, socialSecurityNumber, dateOfBirth, phoneNumber, userId
        // Assuming Practitioner entity: firstName, lastName, type, userId

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(err || 'Failed to create profile');
            }

            // Success
            onProfileCreated();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="create-profile-container">
            <h1>Create Your Profile</h1>
            <p>You are logged in as {userRole} but need to complete your profile.</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name:</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name:</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                        required
                    />
                </div>

                {isPatient && (
                    <>
                        <div className="form-group">
                            <label>Social Security Number:</label>
                            <input
                                type="text"
                                value={formData.socialSecurityNumber}
                                onChange={e => setFormData({ ...formData, socialSecurityNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                value={formData.phoneNumber}
                                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                            />
                        </div>
                    </>
                )}

                {!isPatient && (
                    <div className="form-group">
                        <label>Practitioner Type:</label>
                        <select
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="DOCTOR">Doctor</option>
                            <option value="STAFF">Staff</option>
                        </select>
                    </div>
                )}

                <button type="submit">Create Profile</button>
            </form>
        </div>
    );
};

export default CreateProfilePage;
