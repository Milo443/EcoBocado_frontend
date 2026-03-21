import { apiFetcher } from './api';

export const impactoService = {
    // Obtener métricas globales para la Landing e Impacto
    getGlobal: async () => {
        return apiFetcher('/impacto/global');
    },

    // Obtener métricas específicas del donante autenticado
    getDonorDashboard: async () => {
        return apiFetcher('/impacto/dashboard-donante');
    }
};
