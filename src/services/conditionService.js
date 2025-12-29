import { apiFetch } from '../api/client';

export const conditionService = {
    getByPatient: (patientId, token) =>
        apiFetch(`/conditions/patient/${patientId}`, {}, token),

    create: (data, token) => apiFetch('/conditions', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token),

    update: (id, data, token) => apiFetch(`/conditions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, token)
};
