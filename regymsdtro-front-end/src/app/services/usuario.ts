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
    private readonly base: string = `${API_URL}/usuario`;



    obtenerTodos(page: number = 0, size: number = 5): Observable<PageResponse<UsuarioResponseDto>> {
        const params = new HttpParams()
            .set('page', page)
            .set('size', size);

        return this.http.get<PageResponse<UsuarioResponseDto>>(
            `${this.base}/obtener-todos`,
            { params }
        );
    }

    obtenerPorEmail(email: string): Observable<UsuarioResponseDto> {
        const params = new HttpParams().set('email', email);

        return this.http.get<UsuarioResponseDto>(
            `${this.base}/obtener-por-email`,
            { params }
        );
    }

    obtenerPorId(id: number): Observable<UsuarioResponseDto> {
        return this.http.get<UsuarioResponseDto>(`${this.base}/obtener-${id}`);
    }

    obtenerMiPerfil(): Observable<UsuarioResponseDto> {
        return this.http.get<UsuarioResponseDto>(`${this.base}/obtener`);
    }

    registrarUsuario(request: RegistrarRequest): Observable<UsuarioResponseDto> {
        return this.http.post<UsuarioResponseDto>(`${this.base}/registrar`, request);
    }

    borradoLogico(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/borrado-logico/${id}`);
    }

    borradoFisico(id: number): Observable<void> {
        return this.http.delete<void>(`${this.base}/borrado-fisico/${id}`);
    }

    modificarNombre(nombre: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/modificar-nombre`, { nombre });
    }

    modificarAppat(appat: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/modificar-appat`, { appat });
    }

    modificarApmat(apmat: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/modificar-apmat`, { apmat });
    }

    modificarFechaNacimiento(fechaNacimiento: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/modificar-fechaNacimiento`, { fechaNacimiento });
    }

    modificarSexo(sexo: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/modificar-sexo`, { sexo });
    }


    modificarRolPorId(idUsuario: number, rol: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/admin/modificar-rol`, { idUsuario, rol });
    }

    modificarPlanPorId(idUsuario: number, plan: string): Observable<UsuarioResponseDto> {
        return this.http.patch<UsuarioResponseDto>(`${this.base}/admin/modificar-plan`, { idUsuario, plan });
    }
}