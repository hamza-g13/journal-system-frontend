import { apiFetch } from '../api/client';

export const practitionerService = {
    getAll: (token) => apiFetch('/practitioners', {}, token),

    getMe: (token) => apiFetch('/practitioners/me', {}, token),

    create: (data, token) => apiFetch('/practitioners', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
};
