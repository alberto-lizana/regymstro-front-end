
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface RecuperarPasswordRequest {
    email: string;
}

export interface CodigoRecuperarResponse {
    codigoString: string;
}

export interface RestablecerPasswordRequest {
    email: string;
    codigo: string;
    nuevaPassword: string;
}