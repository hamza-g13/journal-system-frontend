import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../services/patientService';
import { practitionerService } from '../services/practitionerService';
import { locationService } from '../services/locationService';

export const useDoctorDashboard = (token) => {
    const [patients, setPatients] = useState([]);
    const [currentPractitioner, setCurrentPractitioner] = useState(null);
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchInitialData = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const [practitionerData, patientsData, locationsData] = await Promise.all([
                practitionerService.getMe(token),
                patientService.getAll(token),
                locationService.getAll(token)
            ]);

            setCurrentPractitioner(practitionerData);
            setPatients(patientsData || []);
            setLocations(locationsData || []);
        } catch (err) {
            setError('Failed to load initial data: ' + err.message);
            console.error('Error loading initial data:', err);
        } finally {
            setLoading(false);
        }
    }, [token]);

    const refreshLocations = useCallback(async () => {
        try {
            const locationsData = await locationService.getAll(token);
            setLocations(locationsData || []);
        } catch (error) {
            console.error('Error refreshing locations:', error);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchInitialData();
        }
    }, [token, fetchInitialData]);

    return {
        patients,
        currentPractitioner,
        locations,
        loading,
        error,
        refetch: fetchInitialData,
        refreshLocations
    };
};
