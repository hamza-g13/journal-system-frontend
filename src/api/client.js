const API_BASE_URL = "/api";

class ApiError extends Error {
    constructor(message, status, statusText, responseText) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.statusText = statusText;
        this.responseText = responseText;
    }
}

export async function apiFetch(path, options = {}, token) {
    if (!path || typeof path !== 'string') {
        throw new Error('Path must be a non-empty string');
    }

    const url = `${API_BASE_URL}${path}`;
    const headers = {
        ...(options.headers || {}),
    };

    if (options.body && !(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const config = {
        ...options,
        headers,
        credentials: 'include'
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            let errorText = "";
            try {
                errorText = await response.text();
            } catch {
                errorText = response.statusText;
            }

            throw new ApiError(
                errorText || `Request failed: ${response.status} ${response.statusText}`,
                response.status,
                response.statusText,
                errorText
            );
        }

        if (response.status === 204) {
            return null;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }

        return response.text();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(
            error.message || 'Network request failed',
            0,
            'NETWORK_ERROR'
        );
    }
}