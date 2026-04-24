import { useState, useEffect } from 'react';
import { ENDPOINTS } from '@chatbot/shared';
import { apiFetch } from '../lib/api';
export function useConfig(apiKey) {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!apiKey)
            return;
        apiFetch(ENDPOINTS.WIDGET_CONFIG)
            .then((data) => setConfig(data))
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [apiKey]);
    return { config, loading, error };
}
//# sourceMappingURL=use-config.js.map