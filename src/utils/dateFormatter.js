/**
 * Formats a date value to Swedish locale date format
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateValue) => {
    if (!dateValue) return 'Unknown date';

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return 'Invalid date';

        return date.toLocaleDateString('sv-SE', {
            timeZone: 'Europe/Stockholm',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch {
        return 'Invalid date';
    }
};

/**
 * Formats a date value to Swedish locale datetime format
 * @param {string|Date} dateValue - The date to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (dateValue) => {
    if (!dateValue) return 'Unknown date';

    try {
        const date = new Date(dateValue);
        if (isNaN(date.getTime())) return 'Invalid date';

        return date.toLocaleString('sv-SE', {
            timeZone: 'Europe/Stockholm',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return 'Invalid date';
    }
};

/**
 * Extracts date value from message object
 * @param {Object} message - Message object with potential date fields
 * @returns {string|null} Date value or null
 */
export const getMessageDate = (message) => {
    return message.sentDate || message.sentAt || message.createdAt || null;
};
