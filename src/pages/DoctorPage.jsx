// src/pages/DoctorPage.jsx
import { useState } from 'react';
import { useDoctorDashboard } from '../hooks/useDoctorDashboard';
import ErrorMessage from '../components/common/ErrorMessage';
import PatientsList from '../components/lists/PatientsList';
import PatientDashboard from '../components/PatientDashboard';
import './DoctorPage.css';

function DoctorPage({ token }) {
    const {
        patients,
        currentPractitioner,
        locations,
        error: dashboardError,
        refetch: refetchDashboard,
        refreshLocations
    } = useDoctorDashboard(token);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showConditionForm, setShowConditionForm] = useState(false);
    const [showEncounterForm, setShowEncounterForm] = useState(false);
    const [activeTab, setActiveTab] = useState('conditions');
    const [showMyInfo, setShowMyInfo] = useState(false);
    const [feedback, setFeedback] = useState(null);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowConditionForm(false);
        setShowEncounterForm(false);
        setActiveTab('conditions');
        setFeedback(null);
        setShowMyInfo(false);
    };

    if (dashboardError) {
        return <ErrorMessage message={dashboardError} onRetry={refetchDashboard} />;
    }

    return (
        <div className="doctor-page">
            <div className="doctor-header">
                <h1>Doctor Dashboard</h1>
                <p>Manage patient conditions, encounters, and medical records</p>
                {currentPractitioner && (
                    <>
                        <p className="practitioner-info">
                            Logged in as: <strong>Dr. {currentPractitioner.firstName} {currentPractitioner.lastName}</strong>
                        </p>
                        {currentPractitioner.organization && (
                            <p className="practitioner-info">
                                Organization: <strong>{currentPractitioner.organization.name}</strong>
                            </p>
                        )}
                        <button
                            className="btn-view-info"
                            onClick={() => {
                                setShowMyInfo(true);
                                setSelectedPatient(null);
                            }}
                        >
                            View My Information
                        </button>
                    </>
                )}
            </div>

            <div className="doctor-layout">
                <aside className="patients-sidebar">
                    <h3>Patients</h3>
                    <PatientsList
                        patients={patients}
                        selectedPatient={selectedPatient}
                        onPatientSelect={handlePatientSelect}
                    />
                </aside>

                <main>
                    {showMyInfo && currentPractitioner ? (
                        <div className="my-info-section">
                            <h2>My Information</h2>
                            <div className="info-card">
                                <h3>Personal Details</h3>
                                <div className="info-grid">
                                    <div className="info-item">
                                        <label>Full Name</label>
                                        <span>{currentPractitioner.firstName} {currentPractitioner.lastName}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Type</label>
                                        <span className="type-badge">{currentPractitioner.type}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>License Number</label>
                                        <span>{currentPractitioner.licenseNumber}</span>
                                    </div>
                                    {currentPractitioner.organization && (
                                        <>
                                            <div className="info-item">
                                                <label>Organization</label>
                                                <span>{currentPractitioner.organization.name}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>Organization Type</label>
                                                <span>{currentPractitioner.organization.type}</span>
                                            </div>
                                            <div className="info-item">
                                                <label>Address</label>
                                                <span>{currentPractitioner.organization.address || 'N/A'}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <PatientDashboard
                            patient={selectedPatient}
                            practitioner={currentPractitioner}
                            locations={locations}
                            token={token}
                            onRefreshLocations={refreshLocations}
                            activeTab={activeTab}
                            onTabChange={setActiveTab}
                            showConditionForm={showConditionForm}
                            onToggleConditionForm={setShowConditionForm}
                            showEncounterForm={showEncounterForm}
                            onToggleEncounterForm={setShowEncounterForm}
                            feedback={feedback}
                            onShowFeedback={showFeedback}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

export default DoctorPage;