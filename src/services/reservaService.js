import { apiFetcher } from './api';

export const reservaService = {
    // Listar mis reservas activas (Receptor)
    getActivas: async () => {
        return apiFetcher('/reservas/activas');
    },

    // Historial de recogidas (Receptor)
    getHistorial: async () => {
        return apiFetcher('/reservas/historial');
    },

    // Crear una reserva
    reservar: async (loteId) => {
        return apiFetcher('/reservas/', {
            method: 'POST',
            body: JSON.stringify({ lote_id: loteId }),
        });
    },

    // Cancelar reserva
    cancelar: async (reservaId) => {
        return apiFetcher(`/reservas/${reservaId}/cancelar`, {
            method: 'POST'
        });
    },

    // Completar entrega (Solo Donante)
    completar: async (reservaId) => {
        return apiFetcher(`/reservas/${reservaId}/completar`, {
            method: 'POST'
        });
    }
};
