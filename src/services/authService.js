import { apiFetcher } from './api';

export const authService = {
    // Registro de usuario
    register: async (userData) => {
        return apiFetcher('/usuarios/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    },

    // Paso 1: Solicitar OTP
    requestOtp: async (email) => {
        return apiFetcher('/usuarios/login-otp/request', {
            method: 'POST',
            body: JSON.stringify({ email }),
        });
    },

    // Paso 2: Verificar OTP y obtener Token
    verifyOtp: async (email, otpCode) => {
        return apiFetcher('/usuarios/login-otp/verify', {
            method: 'POST',
            body: JSON.stringify({ 
                email, 
                otp_code: otpCode 
            }),
        });
    },

    // Dashboard: Obtener perfil del usuario autenticado
    getPerfil: async () => {
        return apiFetcher('/usuarios/perfil');
    },

    // Actualizar perfil (nombre, direccion, telefono)
    updatePerfil: async (profileData) => {
        return apiFetcher('/usuarios/perfil', {
            method: 'PUT',
            body: JSON.stringify(profileData),
        });
    }
};
