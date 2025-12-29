// src/services/authService.js
import { apiFetch } from '../api/client';

export const authService = {
    login: async (username, password) => {
        const response = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        return response;
    }
};
