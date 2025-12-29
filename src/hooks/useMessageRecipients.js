import { useState, useEffect, useCallback } from 'react';
import { patientService } from '../services/patientService';
import { practitionerService } from '../services/practitionerService';

export const useMessageRecipients = (token, role) => {
    const [recipients, setRecipients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRecipients = useCallback(async () => {
        if (!token || !role) return;

        setLoading(true);
        setError(null);

        try {
            if (role === "patient") {
                const data = await practitionerService.getAll(token);
                setRecipients(
                    data
                        .filter((p) => p.user?.id)
                        .map((p) => ({
                            id: p.user.id,
                            label: `${p.firstName} ${p.lastName} (${p.type})`,
                        }))
                );
            } else {
                const data = await patientService.getAll(token);
                setRecipients(
                    data
                        .filter((p) => p.user?.id)
                        .map((p) => ({
                            id: p.user.id,
                            label: `${p.firstName} ${p.lastName} (patient)`,
                        }))
                );
            }
        } catch (e) {
            setError('Failed to load recipients');
            console.error('Error fetching recipients:', e);
            setRecipients([]);
        } finally {
            setLoading(false);
        }
    }, [token, role]);

    useEffect(() => {
        fetchRecipients();
    }, [fetchRecipients]);

    return {
        recipients,
        loading,
        error,
        refetch: fetchRecipients
    };
};
