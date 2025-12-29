// src/components/PatientDashboard.jsx
import { usePatientData } from '../hooks/usePatientData';
import { conditionService } from '../services/conditionService';
import { encounterService } from '../services/encounterService';
import ConditionsList from './lists/ConditionsList';
import EncountersList from './lists/EncountersList';
import ConditionForm from './forms/ConditionForm';
import EncounterForm from './forms/EncounterForm';

function PatientDashboard({
                              patient,
                              practitioner,
                              locations,
                              token,
                              onRefreshLocations,
                              activeTab = 'conditions',
                              onTabChange,
                              showConditionForm = false,
                              onToggleConditionForm,
                              showEncounterForm = false,
                              onToggleEncounterForm,
                              feedback,
                              onShowFeedback
                          }) {
    const {
        conditions,
        encounters,
        loading: loadingPatientData,
        refetch: refetchPatientData
    } = usePatientData(patient?.id, token);

    const handleCreateCondition = async (conditionData) => {
        try {
            await conditionService.create(conditionData, token);
            await refetchPatientData();
            if (onShowFeedback) {
                onShowFeedback('success', 'Condition added successfully');
            }
            if (onToggleConditionForm) {
                onToggleConditionForm(false);
            }
        } catch (error) {
            if (onShowFeedback) {
                onShowFeedback('error', 'Error creating condition: ' + error.message);
            }
            console.error('Error creating condition:', error);
        }
    };

    const handleCreateEncounter = async (encounterData) => {
        try {
            await encounterService.create(encounterData, token);
            await refetchPatientData();
            if (onShowFeedback) {
                onShowFeedback('success', 'Encounter created successfully');
            }
            if (onToggleEncounterForm) {
                onToggleEncounterForm(false);
            }
        } catch (error) {
            if (onShowFeedback) {
                onShowFeedback('error', 'Error creating encounter: ' + error.message);
            }
            console.error('Error creating encounter:', error);
        }
    };

    if (!patient) {
        return (
            <div className="no-patient-selected">
                <h3>Select a patient to view details</h3>
                <p>Choose a patient from the list to view their medical conditions, encounters, and add new records.</p>
            </div>
        );
    }

    return (
        <div className="patient-details">
            <div className="patient-info">
                <h2>{patient.firstName} {patient.lastName}</h2>
                <div className="patient-meta">
                    <span>SSN: {patient.socialSecurityNumber}</span>
                    <span>DOB: {new Date(patient.dateOfBirth).toLocaleDateString('sv-SE')}</span>
                    <span>Phone: {patient.phoneNumber || 'N/A'}</span>
                </div>
            </div>

            {feedback && (
                <div className={`feedback-banner ${feedback.type}`} role="alert">
                    {feedback.message}
                </div>
            )}

            <div className="tabs">
                <button
                    className={activeTab === 'conditions' ? 'tab active' : 'tab'}
                    onClick={() => onTabChange && onTabChange('conditions')}
                >
                    Conditions ({conditions.length})
                </button>
                <button
                    className={activeTab === 'encounters' ? 'tab active' : 'tab'}
                    onClick={() => onTabChange && onTabChange('encounters')}
                >
                    Encounters ({encounters.length})
                </button>
            </div>

            {loadingPatientData && (
                <div className="loading-text">
                    Loading patient data...
                </div>
            )}

            {activeTab === 'conditions' && !loadingPatientData && (
                <section className="conditions-section">
                    <div className="section-header">
                        <h3>Medical Conditions</h3>
                        <button
                            className="btn-primary"
                            onClick={() => onToggleConditionForm && onToggleConditionForm(!showConditionForm)}
                        >
                            {showConditionForm ? 'Cancel' : 'Add Condition'}
                        </button>
                    </div>

                    {showConditionForm && (
                        <ConditionForm
                            patientId={patient.id}
                            onSubmit={handleCreateCondition}
                            onCancel={() => onToggleConditionForm && onToggleConditionForm(false)}
                        />
                    )}

                    <ConditionsList conditions={conditions} />
                </section>
            )}

            {activeTab === 'encounters' && !loadingPatientData && (
                <section className="encounters-section">
                    <div className="section-header">
                        <h3>Patient Encounters</h3>
                        <button
                            className="btn-primary"
                            onClick={() => onToggleEncounterForm && onToggleEncounterForm(!showEncounterForm)}
                        >
                            {showEncounterForm ? 'Cancel' : 'Add Encounter'}
                        </button>
                    </div>

                    {showEncounterForm && (
                        <EncounterForm
                            patientId={patient.id}
                            practitioner={practitioner}
                            locations={locations}
                            onSubmit={handleCreateEncounter}
                            onCancel={() => onToggleEncounterForm && onToggleEncounterForm(false)}
                            onLocationCreated={onRefreshLocations}
                            token={token}
                        />
                    )}

                    <EncountersList encounters={encounters} />
                </section>
            )}
        </div>
    );
}

export default PatientDashboard;