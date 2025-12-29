// src/pages/AdminPage.jsx
import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { patientService } from '../services/patientService';
import { practitionerService } from '../services/practitionerService';
import { organizationService } from '../services/organizationService';
import AdminTabs from '../components/admin/AdminTabs';
import UserCreationForm from '../components/admin/UserCreationForm';
import './AdminPage.css';

function AdminPage({ token }) {
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [practitioners, setPractitioners] = useState([]);
    const [activeTab, setActiveTab] = useState('users');
    const [loading, setLoading] = useState(false);

    const [newUser, setNewUser] = useState({ username: '', password: '', role: 'PATIENT' });
    const [newPatient, setNewPatient] = useState({
        firstName: '', lastName: '', socialSecurityNumber: '',
        dateOfBirth: '', phoneNumber: '', address: '', userId: ''
    });
    const [newPractitioner, setNewPractitioner] = useState({
        firstName: '', lastName: '', type: 'DOCTOR',
        licenseNumber: '', userId: '', organizationId: ''
    });
    const [newOrganization, setNewOrganization] = useState({
        name: '', type: 'HOSPITAL', address: '',
        city: '', postalCode: '', country: 'Sweden'
    });

    useEffect(() => {
        if (activeTab === 'users') fetchUsers();
        else if (activeTab === 'organizations') fetchOrganizations();
        else if (activeTab === 'practitioners') fetchPractitioners();
    }, [activeTab, token]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAll(token);
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const data = await organizationService.getAll(token);
            setOrganizations(data);
        } catch (err) {
            console.error('Error fetching organizations:', err);
        }
    };

    const fetchPractitioners = async () => {
        try {
            const data = await practitionerService.getAll(token);
            setPractitioners(data);
        } catch (err) {
            console.error('Error fetching practitioners:', err);
        }
    };

    const handleCreateUser = async (userData) => {
        setLoading(true);
        try {
            await userService.create(userData, token);
            setNewUser({ username: '', password: '', role: 'PATIENT' });
            await fetchUsers();
            alert('User created successfully!');
        } catch (err) {
            alert('Create user failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await patientService.create(newPatient, token);
            setNewPatient({
                firstName: '', lastName: '', socialSecurityNumber: '',
                dateOfBirth: '', phoneNumber: '', address: '', userId: ''
            });
            alert('Patient created successfully!');
        } catch (err) {
            alert('Create patient failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePractitioner = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await practitionerService.create(newPractitioner, token);
            setNewPractitioner({
                firstName: '', lastName: '', type: 'DOCTOR',
                licenseNumber: '', userId: '', organizationId: ''
            });
            await fetchPractitioners();
            alert('Practitioner created successfully!');
        } catch (err) {
            alert('Create practitioner failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrganization = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await organizationService.create(newOrganization, token);
            setNewOrganization({
                name: '', type: 'HOSPITAL', address: '',
                city: '', postalCode: '', country: 'Sweden'
            });
            await fetchOrganizations();
            alert('Organization created successfully!');
        } catch (err) {
            alert('Create organization failed: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'users' && (
                <div className="tab-content">
                    <UserCreationForm
                        onSubmit={handleCreateUser}
                        loading={loading}
                        userData={newUser}
                        onUserDataChange={setNewUser}
                    />

                    <h2>All Users</h2>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>
                                        <span className={`role-badge ${u.role.toLowerCase()}`}>
                                            {u.role}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <h2>Create Patient</h2>
                    <form onSubmit={handleCreatePatient}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={newPatient.firstName}
                                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={newPatient.lastName}
                                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Social Security Number</label>
                            <input
                                type="text"
                                value={newPatient.socialSecurityNumber}
                                onChange={(e) => setNewPatient({ ...newPatient, socialSecurityNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={newPatient.dateOfBirth}
                                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                value={newPatient.phoneNumber}
                                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={newPatient.address}
                                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>User ID</label>
                            <input
                                type="number"
                                value={newPatient.userId}
                                onChange={(e) => setNewPatient({ ...newPatient, userId: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Patient'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'organizations' && (
                <div className="tab-content">
                    <h2>Create Organization</h2>
                    <form onSubmit={handleCreateOrganization} className="admin-form">
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                value={newOrganization.name}
                                onChange={(e) => setNewOrganization({ ...newOrganization, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={newOrganization.type}
                                onChange={(e) => setNewOrganization({ ...newOrganization, type: e.target.value })}
                            >
                                <option value="HOSPITAL">Hospital</option>
                                <option value="CLINIC">Clinic</option>
                                <option value="LABORATORY">Laboratory</option>
                                <option value="PHARMACY">Pharmacy</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Address</label>
                            <input
                                type="text"
                                value={newOrganization.address}
                                onChange={(e) => setNewOrganization({ ...newOrganization, address: e.target.value })}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    value={newOrganization.city}
                                    onChange={(e) => setNewOrganization({ ...newOrganization, city: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Postal Code</label>
                                <input
                                    type="text"
                                    value={newOrganization.postalCode}
                                    onChange={(e) => setNewOrganization({ ...newOrganization, postalCode: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Country</label>
                            <input
                                type="text"
                                value={newOrganization.country}
                                onChange={(e) => setNewOrganization({ ...newOrganization, country: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Organization'}
                        </button>
                    </form>

                    <h2>All Organizations</h2>
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>City</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {organizations.map((org) => (
                                <tr key={org.id}>
                                    <td>{org.id}</td>
                                    <td>{org.name}</td>
                                    <td>{org.type}</td>
                                    <td>{org.city}</td>
                                    <td>{org.address || 'N/A'}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'practitioners' && (
                <div className="tab-content">
                    <h2>Create Practitioner</h2>
                    <form onSubmit={handleCreatePractitioner}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    type="text"
                                    value={newPractitioner.firstName}
                                    onChange={(e) => setNewPractitioner({ ...newPractitioner, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    value={newPractitioner.lastName}
                                    onChange={(e) => setNewPractitioner({ ...newPractitioner, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Type</label>
                            <select
                                value={newPractitioner.type}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, type: e.target.value })}
                            >
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                                <option value="SPECIALIST">Specialist</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>License Number</label>
                            <input
                                type="text"
                                value={newPractitioner.licenseNumber}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, licenseNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>User ID</label>
                            <input
                                type="number"
                                value={newPractitioner.userId}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, userId: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Organization</label>
                            <select
                                value={newPractitioner.organizationId}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, organizationId: e.target.value })}
                            >
                                <option value="">Select Organization (optional)</option>
                                {organizations.map((org) => (
                                    <option key={org.id} value={org.id}>
                                        {org.name} - {org.city}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Practitioner'}
                        </button>
                    </form>

                    <h2>All Practitioners</h2>
                    <table className="admin-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>License</th>
                            <th>Organization</th>
                        </tr>
                        </thead>
                        <tbody>
                        {practitioners.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.firstName} {p.lastName}</td>
                                <td>
                                    <span className="type-badge">{p.type}</span>
                                </td>
                                <td>{p.licenseNumber}</td>
                                <td>{p.organizationName || 'N/A'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPage;