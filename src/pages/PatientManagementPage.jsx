// src/pages/PatientManagementPage.jsx
import { useState, useEffect } from 'react';
import { patientService } from '../services/patientService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './PatientManagementPage.css';

function PatientManagementPage({ token }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatients();
    }, [token]);

    const fetchPatients = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await patientService.getAll(token);
            setPatients(data);
        } catch (e) {
            console.error('Error fetching patients:', e);
            setError('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner message="Loading patients..." />;

    if (error) {
        return (
            <div className="patient-management-page">
                <div className="error-message">
                    <h2>Error</h2>
                    <p>{error}</p>
                    <button onClick={fetchPatients} className="btn-primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-management-page">
            <div className="page-header">
                <h1>Patient Management</h1>
                <p>View and manage all patients</p>
            </div>

            <div className="patients-table-container">
                <table className="patients-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Social Security Number</th>
                        <th>Date of Birth</th>
                        <th>Phone</th>
                        <th>Address</th>
                    </tr>
                    </thead>
                    <tbody>
                    {patients.map((p) => (
                        <tr key={p.id}>
                            <td><strong>{p.firstName} {p.lastName}</strong></td>
                            <td>{p.socialSecurityNumber}</td>
                            <td>{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                            <td>{p.phoneNumber || 'N/A'}</td>
                            <td>{p.address || 'N/A'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {patients.length === 0 && (
                    <div className="no-data">
                        <p>No patients found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientManagementPage;
