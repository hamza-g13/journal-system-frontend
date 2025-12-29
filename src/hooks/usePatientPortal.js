import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../services/patientService';
import { conditionService } from '../services/conditionService';
import { encounterService } from '../services/encounterService';
import { messageService } from '../services/msgService';

export const usePatientPortal = (token, userId) => {
    const [patient, setPatient] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [encounters, setEncounters] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPatientData = useCallback(async () => {
        if (!token || !userId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const patientData = await patientService.getMe(token);

            if (!patientData) {
                // User is not a patient
                console.log('User is not a patient');
                setPatient(null);
                setLoading(false);
                return;
            }

            const [conditionsData, encountersData, unreadData] = await Promise.all([
                conditionService.getByPatient(patientData.id, token),
                encounterService.getByPatient(patientData.id, token),
                messageService.getUnread(token)
            ]);

            setPatient(patientData);
            setConditions(conditionsData || []);
            setEncounters(encountersData || []);
            setUnreadMessages(typeof unreadData === 'number' ? unreadData : (unreadData?.length || 0));
        } catch (err) {
            setError('Failed to load patient data: ' + err.message);
            console.error('Error fetching patient data:', err);
            setPatient(null);
        } finally {
            setLoading(false);
        }
    }, [token, userId]);

    useEffect(() => {
        fetchPatientData();
    }, [fetchPatientData]);

    // Computed values
    const activeConditionsCount = conditions.filter(c => c.status === 'ACTIVE').length;
    const recentConditions = conditions.slice(0, 3);

    return {
        patient,
        conditions,
        encounters,
        unreadMessages,
        loading,
        error,
        refetch: fetchPatientData,
        // Computed values
        activeConditionsCount,
        recentConditions
    };
};
