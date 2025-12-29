import { useState, useEffect } from 'react';
import { apiFetch } from '../api/client';

export function useFetch(path, token, dependencies = []) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!token || !path) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const result = await apiFetch(path, {}, token);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [path, token, ...dependencies]);

    return { data, loading, error, refetch: fetchData };
}
