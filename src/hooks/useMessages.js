import { useState, useEffect, useCallback } from 'react';
import { messageService } from '../services/msgService';

export const useMessages = (token) => {
    const [inboxMessages, setInboxMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!token) return;
        setError(null);

        try {
            // 1. Hämta Inbox
            const inboxData = await messageService.getInbox(token);
            // SÄKERHET: Se till att vi alltid har en array, även om API ger null/undefined
            const safeInbox = Array.isArray(inboxData) ? inboxData : [];

            setInboxMessages(safeInbox);
            setUnreadCount(safeInbox.filter(m => !m.isRead).length);

            // 2. Hämta Sent (Skickat)
            try {
                const sentData = await messageService.getSent(token);
                const safeSent = Array.isArray(sentData) ? sentData : [];
                setSentMessages(safeSent);
            } catch (sentError) {
                console.warn('Error fetching sent messages (non-critical):', sentError);
                setSentMessages([]); // Fallback till tom lista
            }

        } catch (e) {
            console.error('Error fetching messages:', e);
            setError('Failed to load messages');
            // Sätt tomma arrayer för att undvika krasch i UI vid .map()
            setInboxMessages([]);
            setSentMessages([]);
            setUnreadCount(0);
        }
    }, [token]);

    const markAsRead = useCallback(async (messageId) => {
        try {
            // Optimistic update: Uppdatera UI direkt för snabbare känsla
            setInboxMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId ? { ...msg, isRead: true } : msg
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Anropa backend
            await messageService.markAsRead(messageId, token);
        } catch (e) {
            console.error('Error marking message as read:', e);
            // Vid fel: Ladda om riktig data för att synka
            fetchMessages();
        }
    }, [token, fetchMessages]);

    const sendMessage = useCallback(async (messageData) => {
        try {
            await messageService.send(messageData, token);
            await fetchMessages(); // Uppdatera listorna (t.ex. sent messages)
            return { success: true };
        } catch (e) {
            console.error('Error sending message:', e);
            return { success: false, error: e.message };
        }
    }, [token, fetchMessages]);

    // Ladda meddelanden när token ändras (vid inloggning/sidladdning)
    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return {
        inboxMessages,
        sentMessages,
        unreadCount,
        error,
        markAsRead,
        sendMessage,
        refetch: fetchMessages
    };
};
