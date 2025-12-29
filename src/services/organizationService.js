// src/services/organizationService.js
import { apiFetch } from '../api/client';

export const organizationService = {
    getAll: (token) => apiFetch('/organizations', {}, token),

    create: (data, token) =>
        apiFetch('/organizations', {
            method: 'POST',
            body: JSON.stringify(data),
        }, token),
};
