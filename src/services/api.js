const BASE_URL = 'http://localhost:8080/api/v1';

export const apiFetcher = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
            status: response.status,
            message: errorData.detail || 'Algo salió mal',
            ...errorData
        };
    }

    if (response.status === 204) return null;
    return response.json();
};
