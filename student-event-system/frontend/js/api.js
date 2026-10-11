// =====================================================================
// Centralized API Client with Fetch API
// =====================================================================

const API = (() => {
    // Determine base URL dynamically
    const getBaseUrl = () => {
        if (window.location.protocol === 'file:' || (window.location.port && window.location.port !== '8080')) {
            return 'http://localhost:8080/api';
        }
        return '/api';
    };

    const BASE_URL = getBaseUrl();

    async function request(endpoint, options = {}) {
        const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        };

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...(options.headers || {})
            },
            credentials: 'include' // Sends session cookies across local ports
        };

        try {
            const response = await fetch(url, config);

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            // Check if response is CSV download
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/csv')) {
                const blob = await response.blob();
                return blob;
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                // Handle 401 Unauthorized
                if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
                    Auth.clearUser();
                }

                const errorMessage = data.message || data.error || `Request failed with status ${response.status}`;
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = data;
                throw error;
            }

            return data;
        } catch (err) {
            console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, err);
            throw err;
        }
    }

    return {
        getBaseUrl: () => BASE_URL,
        get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
        post: (endpoint, data, options = {}) => request(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
        put: (endpoint, data, options = {}) => request(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
        patch: (endpoint, data, options = {}) => request(endpoint, { method: 'PATCH', body: JSON.stringify(data), ...options }),
        delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options }),

        // Trigger CSV download
        downloadCsv: async (endpoint, filename = 'export.csv') => {
            const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include'
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.message || 'Failed to download CSV report');
            }

            const blob = await response.blob();
            const downloadUrl = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(downloadUrl);
            document.body.removeChild(a);
        }
    };
})();
