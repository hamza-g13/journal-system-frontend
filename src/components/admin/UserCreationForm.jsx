// src/components/admin/UserCreationForm.jsx
import { useState } from 'react';

function UserCreationForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'PATIENT'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ username: '', password: '', role: 'PATIENT' });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Create User</h3>
            <div className="form-group">
                <label>Username</label>
                <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                />
            </div>
            <div className="form-group">
                <label>Role</label>
                <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                    <option value="PATIENT">Patient</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                </select>
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
            </button>
        </form>
    );
}

export default UserCreationForm;