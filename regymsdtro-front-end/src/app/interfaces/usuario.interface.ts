export type Sexo = 'MASCULINO' | 'FEMENINO';

export interface UsuarioResponseDto {
    idUsuario: number;
    nombre: string;
    appat: string;
    apmat: string;
    fechaNacimiento: string;
    email: string;
    isActive: boolean;
    plan: string;
    nombreRol: string;
    sexo: string;
}

export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface RegistrarRequest {
    nombre: string;
    appat: string;
    apmat: string;
    fechaNacimiento: string;
    email: string;
    password: string;
    sexo: string;
}