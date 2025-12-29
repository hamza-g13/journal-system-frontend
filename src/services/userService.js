import { apiFetch } from '../api/client';

export const userService = {
    getAll: (token) => apiFetch('/users', {}, token),

    create: (data, token) => apiFetch('/users', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token)
};
