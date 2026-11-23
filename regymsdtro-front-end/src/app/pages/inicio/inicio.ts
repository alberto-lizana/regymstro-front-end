import { Component, inject, OnInit, signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { UsuarioResponseDto } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  private readonly usuarioService = inject(UsuarioService);

  readonly perfil = signal<UsuarioResponseDto | null>(null);
  readonly error = signal('');

  ngOnInit(): void {
    this.usuarioService.obtenerMiPerfil().subscribe({
      next: (p) => this.perfil.set(p),
      error: () => this.error.set('No se pudo cargar tu perfil.'),
    });
  }
}