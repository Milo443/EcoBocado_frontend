import { apiFetcher } from './api';

export const storageService = {
    /**
     * Sube una imagen al servidor (MinIO)
     * @param {File} file 
     * @returns {Promise<{imagen_url: string}>}
     */
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Usamos una petición manual aquí porque apiFetcher asume JSON por defecto
        // y necesitamos multipart/form-data sin establecer el Content-Type manualmente
        // para que el navegador ponga el boundary correcto.
        const token = localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'}/lotes/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Error al subir la imagen');
        }

        return response.json();
    }
};
