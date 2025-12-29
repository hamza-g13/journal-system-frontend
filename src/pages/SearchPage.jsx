import React, { useState } from 'react';
import { searchService } from '../services/searchService';
import { patientService } from '../services/patientService';
import { conditionService } from '../services/conditionService';
import { encounterService } from '../services/encounterService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import StatusBadge from '../components/common/StatusBadge';
import './SearchPage.css';

export default function SearchPage({ token, userId, role }) {
    const [searchMode, setSearchMode] = useState('patient'); // patient, condition, doctor, my-encounters
    const [query, setQuery] = useState('');
    const [date, setDate] = useState('');
    const [results, setResults] = useState(null);
    const [selectedPatientDetails, setSelectedPatientDetails] = useState(null);
    const [selectedDoctorPatients, setSelectedDoctorPatients] = useState(null); // List of patients for a doctor
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sökfunktion
    const handleSearch = async () => {
        if (searchMode !== 'my-encounters' && !query.trim()) return;
        if (searchMode === 'my-encounters' && !date) return;

        setLoading(true);
        setError(null);
        setResults(null);

        try {
            let data;
            switch (searchMode) {
                case 'patient':
                    data = await searchService.searchPatients(query, token);
                    break;
                case 'condition':
                    data = await searchService.searchPatientsByCondition(query, token);
                    break;
                case 'doctor':
                    data = await searchService.searchDoctors(query, token);
                    break;
                case 'my-encounters':
                    // Använd userId direkt som doctorId (om inloggad är läkare)
                    // Om searchService förväntar sig doctorId, skicka userId.
                    data = await searchService.searchEncounters(userId, date, token);
                    break;
                default:
                    break;
            }
            setResults(data || []);
        } catch (err) {
            setError('Search failed: ' + err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    // Klick på patient för att visa detaljer i modal
    const handlePatientClick = async (patient) => {
        setLoading(true);
        try {
            // Hämta detaljerad info parallellt
            const [conditions, encounters] = await Promise.all([
                conditionService.getByPatient(patient.id, token),
                encounterService.getByPatient(patient.id, token)
            ]);

            setSelectedPatientDetails({
                ...patient,
                conditions,
                encounters
            });
        } catch (err) {
            console.error("Failed to fetch details", err);
            alert("Could not load patient details");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedPatientDetails(null);
        setSelectedDoctorPatients(null);
    };

    const handleDoctorPatientsClick = async (doctor) => {
        setLoading(true);
        try {
            const data = await searchService.getDoctorPatients(doctor.id, token);
            setSelectedDoctorPatients({
                doctorName: `${doctor.firstName} ${doctor.lastName}`,
                patients: data || []
            });
        } catch (err) {
            console.error("Failed to fetch doctor patients", err);
            alert("Could not load patients for this doctor");
        } finally {
            setLoading(false);
        }
    };

    // Renderingsfunktioner
    const renderResults = () => {
        if (!results) return null;
        if (results.length === 0) {
            return <div className="no-results"><h3>No results found</h3></div>;
        }

        if (searchMode === 'my-encounters') {
            return (
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Patient</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((enc, idx) => (
                            <tr key={enc.id || idx}>
                                <td>{new Date(enc.encounterDate).toLocaleTimeString()}</td>
                                <td>{enc.patientName || 'Unknown'}</td>
                                <td>{enc.type}</td>
                                <td>{enc.location ? `${enc.location.name}, ${enc.location.city}` : 'N/A'}</td>
                                <td>{enc.reasonForVisit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        if (searchMode === 'doctor') {
            return (
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Organization</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((doc) => (
                            <tr key={doc.id}>
                                <td>Dr. {doc.firstName} {doc.lastName}</td>
                                <td>{doc.type}</td>
                                <td>{doc.organizationName || 'N/A'}</td>
                                <td>
                                    <button
                                        className="btn-secondary btn-sm"
                                        onClick={() => handleDoctorPatientsClick(doc)}
                                    >
                                        Patients
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // Patient & Condition search
        return (
            <table className="results-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>SSN</th>
                        <th>DOB</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((p) => (
                        <tr key={p.id} className="result-row">
                            <td>{p.firstName} {p.lastName}</td>
                            <td>{p.socialSecurityNumber}</td>
                            <td>{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                            <td>
                                <button
                                    className="btn-secondary btn-sm"
                                    onClick={() => handlePatientClick(p)}
                                >
                                    View Details
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="search-page">
            <div className="search-header">
                <h1>Search Portal</h1>
                <p>Find patients, conditions, doctors, or view your schedule.</p>
            </div>

            <div className="search-tabs">
                {[
                    { id: 'patient', label: 'Patient Name/SSN' },
                    { id: 'condition', label: 'Condition' },
                    { id: 'doctor', label: 'Find Doctor' },
                    { id: 'my-encounters', label: 'My Encounters' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-btn ${searchMode === tab.id ? 'active' : ''}`}
                        onClick={() => {
                            setSearchMode(tab.id);
                            setResults(null);
                            setQuery('');
                            setDate('');
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="search-controls">
                <div className="search-input-group">
                    {searchMode === 'my-encounters' ? (
                        <input
                            type="date"
                            className="search-input"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    ) : (
                        <div className="search-input-wrapper">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                className="search-input"
                                placeholder={`Search by ${searchMode}...`}
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                    )}

                    <button
                        className="search-btn"
                        onClick={handleSearch}
                        disabled={loading || (searchMode === 'my-encounters' ? !date : !query.trim())}
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="search-results">
                {loading && <LoadingSpinner message="Fetching results..." />}
                {!loading && renderResults()}
            </div>

            {/* Patient Detail Modal */}
            {selectedPatientDetails && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>{selectedPatientDetails.firstName} {selectedPatientDetails.lastName}</h2>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="info-section">
                                <h3>Personal Info</h3>
                                <p><strong>SSN:</strong> {selectedPatientDetails.socialSecurityNumber}</p>
                                <p><strong>DOB:</strong> {new Date(selectedPatientDetails.dateOfBirth).toLocaleDateString()}</p>
                            </div>

                            <div className="info-section">
                                <h3>Conditions</h3>
                                {selectedPatientDetails.conditions?.length > 0 ? (
                                    <ul className="detail-list">
                                        {selectedPatientDetails.conditions.map(c => (
                                            <li key={c.id}>
                                                <strong>{c.diagnosis}</strong> - <StatusBadge status={c.status} />
                                                <p className="text-sm text-gray">{c.description}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-muted">No conditions found.</p>}
                            </div>

                            <div className="info-section">
                                <h3>Recent Encounters</h3>
                                {selectedPatientDetails.encounters?.length > 0 ? (
                                    <ul className="detail-list">
                                        {selectedPatientDetails.encounters.slice(0, 5).map(e => (
                                            <li key={e.id}>
                                                <strong>{new Date(e.encounterDate).toLocaleDateString()}</strong> - {e.type}
                                                <p className="text-sm">{e.reasonForVisit}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : <p className="text-muted">No encounters found.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Doctor Patients Modal */}
            {selectedDoctorPatients && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Patients of {selectedDoctorPatients.doctorName}</h2>
                            <button className="close-btn" onClick={closeModal}>×</button>
                        </div>
                        <div className="modal-body">
                            {selectedDoctorPatients.patients.length > 0 ? (
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>SSN</th>
                                            <th>DOB</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedDoctorPatients.patients.map((p) => (
                                            <tr key={p.id}>
                                                <td>{p.firstName} {p.lastName}</td>
                                                <td>{p.socialSecurityNumber}</td>
                                                <td>{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                                                <td>
                                                    <button
                                                        className="btn-secondary btn-sm"
                                                        onClick={() => {
                                                            closeModal(); // Close this modal first
                                                            handlePatientClick(p); // Open patient details
                                                        }}
                                                    >
                                                        View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted">No associated patients found.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
