import { useState, useEffect, useCallback } from 'react';
import { conditionService } from '../services/conditionService';
import { encounterService } from '../services/encounterService';

export const usePatientData = (patientId, token) => {
    const [conditions, setConditions] = useState([]);
    const [encounters, setEncounters] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPatientData = useCallback(async () => {
        if (!patientId || !token) {
            setConditions([]);
            setEncounters([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const [conditionsData, encountersData] = await Promise.all([
                conditionService.getByPatient(patientId, token),
                encounterService.getByPatient(patientId, token)
            ]);

            setConditions(conditionsData || []);
            setEncounters(encountersData || []);
        } catch (err) {
            setError('Failed to load patient data: ' + err.message);
            console.error('Error fetching patient data:', err);
            setConditions([]);
            setEncounters([]);
        } finally {
            setLoading(false);
        }
    }, [patientId, token]);

    useEffect(() => {
        fetchPatientData();
    }, [fetchPatientData]);

    return {
        conditions,
        encounters,
        loading,
        error,
        refetch: fetchPatientData
    };
};
