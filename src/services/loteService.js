import { apiFetcher } from './api';

export const loteService = {
    // Listar lotes activos (Público/Receptor)
    getActivos: async () => {
        return apiFetcher('/lotes/activos');
    },

    // Mis publicaciones (Solo Donante)
    getMisLotes: async () => {
        return apiFetcher('/lotes/mis-lotes');
    },

    // Publicar nuevo lote
    publish: async (loteData) => {
        return apiFetcher('/lotes/', {
            method: 'POST',
            body: JSON.stringify(loteData),
        });
    },

    // Ver detalles de un lote
    getById: async (id) => {
        return apiFetcher(`/lotes/${id}`);
    },

    // Eliminar lote
    delete: async (id) => {
        return apiFetcher(`/lotes/${id}`, {
            method: 'DELETE',
        });
    },

    // Actualizar lote
    update: async (id, loteData) => {
        return apiFetcher(`/lotes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(loteData),
        });
    }
};
