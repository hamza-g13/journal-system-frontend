import { apiFetch } from '../api/client';

export const locationService = {
    getAll: (token) => apiFetch('/locations', {}, token),

    create: (data, token) => apiFetch('/locations', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
};
