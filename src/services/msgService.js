// src/services/messageService.js
import { apiFetch } from '../api/client';

export const messageService = {
    getInbox: (token) => apiFetch('/messages/inbox', {}, token),

    getSent: (token) => apiFetch('/messages/sent', {}, token),

    getUnread: (token) => apiFetch('/messages/unread-count', {}, token),

    send: (data, token) => apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(data)
    }, token),

    markAsRead: (id, token) => apiFetch(`/messages/${id}/read`, {
        method: 'PUT'
    }, token)
};
