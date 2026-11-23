import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';

import { UsuarioService } from '../../services/usuario';
import { UsuarioResponseDto } from '../../interfaces/usuario.interface';

@Component({
    selector: 'app-asignar-rol-plan',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './asignar-rol-plan.html'
})
export class AsignarRolPlan implements OnInit {

    private readonly usuarioService = inject(UsuarioService);
    private readonly fb = inject(NonNullableFormBuilder);

    // Entrada: el usuario a editar
    readonly usuario = input.required<UsuarioResponseDto & { nombreCompleto: string }>();

    // Salidas: el padre se entera
    readonly guardado = output<void>();
    readonly cancelado = output<void>();

    readonly roles = ['USUARIO', 'ADMIN'];
    readonly planes = ['FREE', 'PREMIUM'];

    readonly guardando = signal(false);
    readonly error = signal('');

    readonly form = this.fb.group({
        rol: ['', Validators.required],
        plan: ['', Validators.required],
    });

    ngOnInit(): void {
        const u = this.usuario();
        this.form.setValue({ rol: u.nombreRol ?? '', plan: u.plan ?? '' });
    }

    guardar(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        const u = this.usuario();
        const v = this.form.getRawValue();
        const cambios: Observable<UsuarioResponseDto>[] = [];

        if (v.rol !== u.nombreRol) cambios.push(this.usuarioService.modificarRolPorId(u.idUsuario, v.rol));
        if (v.plan !== u.plan) cambios.push(this.usuarioService.modificarPlanPorId(u.idUsuario, v.plan));

        if (cambios.length === 0) {
            this.cancelado.emit();
            return;
        }

        this.guardando.set(true);
        this.error.set('');

        forkJoin(cambios).subscribe({
            next: () => {
                this.guardando.set(false);
                this.guardado.emit();
            },
            error: (err) => {
                console.error('ERROR HTTP:', err);
                this.guardando.set(false);
                this.error.set(err.error?.message ?? 'No se pudieron guardar los cambios.');
            },
        });
    }
}