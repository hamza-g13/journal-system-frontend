import { apiFetch } from '../api/client';

export const patientService = {
    getAll: (token) => apiFetch('/patients', {}, token),

    getById: (id, token) => apiFetch(`/patients/${id}`, {}, token),

    getMe: (token) => apiFetch('/patients/me', {}, token),

    create: (data, token) => apiFetch('/patients', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token),

    update: (id, data, token) => apiFetch(`/patients/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }, token)
};
