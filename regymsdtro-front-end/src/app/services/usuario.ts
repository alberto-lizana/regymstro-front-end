import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../utils/api-url';

import {
    UsuarioResponseDto,
    PageResponse,
    RegistrarRequest
} from '../interfaces/usuario.interface';

@Injectable({
    providedIn: 'root'
})
export class UsuarioService {

    private readonly http = inject(HttpClient);



    obtenerTodos(page: number = 0, size: number = 5): Observable<PageResponse<UsuarioResponseDto>> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<PageResponse<UsuarioResponseDto>>(
            `${API_URL}/obtener-todos`,
            { params }
        );
    }

    obtenerPorEmail(email: string): Observable<UsuarioResponseDto> {
        const params = new HttpParams().set('email', email);

        return this.http.get<UsuarioResponseDto>(
            `${API_URL}/obtener-por-email`,
            { params }
        );
    }

    obtenerPorId(id: number): Observable<UsuarioResponseDto> {
        return this.http.get<UsuarioResponseDto>(`${API_URL}/obtener-${id}`);
    }

    obtenerMiPerfil(): Observable<UsuarioResponseDto> {
        return this.http.get<UsuarioResponseDto>(`${API_URL}/obtener`);
    }

    registrarUsuario(request: RegistrarRequest): Observable<UsuarioResponseDto> {
        return this.http.post<UsuarioResponseDto>(`${API_URL}/registrar`, request);
    }

    borradoLogico(id: number): Observable<void> {
        return this.http.delete<void>(`${API_URL}/borrado-logico/${id}`);
    }

    borradoFisico(id: number): Observable<void> {
        return this.http.delete<void>(`${API_URL}/borrado-fisico/${id}`);
    }

    modificarNombre(nombre: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/modificar-nombre`, { nombre });
    }

    modificarAppat(appat: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/modificar-appat`, { appat });
    }

    modificarApmat(apmat: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/modificar-apmat`, { apmat });
    }

    modificarFechaNacimiento(fechaNacimiento: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/modificar-fechaNacimiento`, { fechaNacimiento });
    }

    modificarSexo(sexo: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/modificar-sexo`, { sexo });
    }


    modificarRolPorId(idUsuario: number, rol: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/admin/modificar-rol`, { idUsuario, rol });
    }

    modificarPlanPorId(idUsuario: number, plan: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${API_URL}/admin/modificar-plan`, { idUsuario, plan });
    }
}