import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePatientPortal } from '../hooks/usePatientPortal';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import './PatientPage.css';

function PatientPage({ token, userId }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');

    const {
        patient,
        conditions,
        encounters,
        unreadMessages,
        loading,
        error,
        activeConditionsCount,
        recentConditions
    } = usePatientPortal(token, userId);

    if (loading) {
        return <LoadingSpinner message="Loading your information..." />;
    }

    if (error) {
        return (
            <div className="patient-page">
                <div className="error-message" role="alert">
                    <h2>Error Loading Data</h2>
                    <p>{error}</p>
                    <button onClick={() => navigate(-1)} className="btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!patient) {
        return (
            <div className="patient-page">
                <div className="error-message">
                    <h2>Access Restricted</h2>
                    <p>This page is only available for patients.</p>
                    <button onClick={() => navigate(-1)} className="btn-primary">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-page">
            <div className="patient-header">
                <h1>Welcome, {patient.firstName} {patient.lastName}</h1>
                <p>View your medical records and communicate with your healthcare team</p>
            </div>

            <div className="patient-stats">
                <div className="stat-card">
                    <h3>Active Conditions</h3>
                    <p className="stat-number">{activeConditionsCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Encounters</h3>
                    <p className="stat-number">{encounters.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Unread Messages</h3>
                    <p className="stat-number">{unreadMessages}</p>
                </div>
            </div>

            <div className="quick-actions">
                <Link to="/messages" className="action-button">
                    <span className="action-icon">✉️</span>
                    <span>Messages</span>
                    {unreadMessages > 0 && (
                        <span className="notification-badge">{unreadMessages}</span>
                    )}
                </Link>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === 'overview' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('overview')}
                    aria-selected={activeTab === 'overview'}
                    role="tab"
                >
                    Overview
                </button>
                <button
                    className={activeTab === 'conditions' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('conditions')}
                    aria-selected={activeTab === 'conditions'}
                    role="tab"
                >
                    Medical Conditions ({conditions.length})
                </button>
                <button
                    className={activeTab === 'encounters' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('encounters')}
                    aria-selected={activeTab === 'encounters'}
                    role="tab"
                >
                    Encounters ({encounters.length})
                </button>
            </div>

            <div className="tab-content" role="tabpanel">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <div className="info-card">
                            <h3>Personal Information</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <strong>Date of Birth:</strong>
                                    <span>{new Date(patient.dateOfBirth).toLocaleDateString('sv-SE')}</span>
                                </div>
                                <div className="info-item">
                                    <strong>SSN:</strong>
                                    <span>{patient.socialSecurityNumber}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Phone:</strong>
                                    <span>{patient.phoneNumber || 'Not provided'}</span>
                                </div>
                                <div className="info-item">
                                    <strong>Address:</strong>
                                    <span>{patient.address || 'Not provided'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="recent-section">
                            <h3>Recent Medical Conditions</h3>
                            {recentConditions.length === 0 ? (
                                <p className="no-data">No medical conditions recorded</p>
                            ) : (
                                recentConditions.map(condition => (
                                    <div key={condition.id} className="card">
                                        <div className="card-header">
                                            <h4>{condition.diagnosis}</h4>
                                            <StatusBadge status={condition.status} />
                                        </div>
                                        {condition.description && (
                                            <p className="card-description">{condition.description}</p>
                                        )}
                                        <div className="card-meta">
                                            <span>Severity: {condition.severity || 'Not specified'}</span>
                                            <span>
                                                Diagnosed: {new Date(condition.diagnosisDate).toLocaleDateString('sv-SE')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'conditions' && (
                    <div className="conditions-section">
                        <h2>Medical Conditions</h2>
                        {conditions.length === 0 ? (
                            <p className="no-data">No medical conditions recorded</p>
                        ) : (
                            <div className="conditions-list">
                                {conditions.map(condition => (
                                    <div key={condition.id} className="card">
                                        <div className="card-header">
                                            <h4>{condition.diagnosis}</h4>
                                            <StatusBadge status={condition.status} />
                                        </div>
                                        {condition.description && (
                                            <p className="card-description">{condition.description}</p>
                                        )}
                                        <div className="card-meta">
                                            <span>Severity: {condition.severity || 'Not specified'}</span>
                                            <span>
                                                Diagnosed: {new Date(condition.diagnosisDate).toLocaleDateString('sv-SE')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'encounters' && (
                    <div className="encounters-section">
                        <h2>Medical Encounters</h2>
                        {encounters.length === 0 ? (
                            <p className="no-data">No encounters recorded</p>
                        ) : (
                            <div className="encounters-list">
                                {encounters.map(encounter => (
                                    <div key={encounter.id} className="card">
                                        <div className="card-header">
                                            <h4>{encounter.type.replace('_', ' ')}</h4>
                                            <span className="date-badge">
                                                {new Date(encounter.encounterDate).toLocaleDateString('sv-SE')}
                                            </span>
                                        </div>
                                        <div className="encounter-details">
                                            <p>
                                                <strong>Practitioner:</strong> {encounter.practitionerName}
                                            </p>
                                            <p>
                                                <strong>Reason:</strong> {encounter.reasonForVisit}
                                            </p>
                                            {encounter.notes && (
                                                <p>
                                                    <strong>Notes:</strong> {encounter.notes}
                                                </p>
                                            )}
                                            {encounter.location && (
                                                <p>
                                                    <strong>Location:</strong> {encounter.location.name}, {encounter.location.city}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientPage;
