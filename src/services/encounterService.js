import { apiFetch } from '../api/client';

export const encounterService = {
    getByPatient: (patientId, token) =>
        apiFetch(`/encounters/patient/${patientId}`, {}, token),

    create: (data, token) => apiFetch('/encounters', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
};
