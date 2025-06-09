import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { Usuario } from '../../servicios/api-servicios/api.models';

@Component({
  selector: 'app-user-link',
  imports: [CommonModule, RouterModule],
  templateUrl: './user-link.component.html',
  styleUrl: './user-link.component.css'
})
export class UserLinkComponent implements OnInit {
  @Input() user!: Usuario;
  @Input() label?: string;
  @Input() linkClass = '';
  @Input() asButton = false;

  friendIds: number[] = [];
  currentUserId: number | null = null;

  constructor(
    private auth: AutenticacionService,
    private router: Router,
    private api: ApiService,
    private msj: MensajeGlobalService
  ) { }

  get isAuth(): boolean {
    return !!this.auth.obtenerToken();
  }

  ngOnInit(): void {
    if (!this.isAuth) return;
    this.api.getUsuarioPorToken().subscribe({
      next: me => {
        this.currentUserId = me.id;
        this.api.getAmigos().subscribe(a => {
          this.friendIds = a.map(u => u.id);
        });
      },
      error: () => this.currentUserId = null
    });
  }

  async onClick(event: MouseEvent): Promise<void> {
    event.preventDefault();

    if (!this.isAuth) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const isSelf   = this.user.id === this.currentUserId;
    const isFriend = this.friendIds.includes(this.user.id);

    if (isSelf || isFriend) {
      this.router.navigate(['/perfil', this.user.id]);
      return;
    }

    // Confirmación con el modal unificado
    const ok = await this.msj.confirmar(
      `Para ver el perfil de "${this.user.username}" debes enviarle una solicitud. ¿Continuar?`
    );
    if (!ok) return;

    // Llamada al servicio: él mismo mostrará el toast de éxito o error
    this.api.enviarSolicitudAmistad(this.user.id).subscribe({
      next: () => {
        // Actualizamos localmente para no volver a enviar
        this.friendIds.push(this.user.id);
      },
      error: () => {
        // El toast de error ya lo muestra handleError()
      }
    });
  }

  /** Clase dinámica para el botón */
  get buttonClass(): string {
    const base = 'btn btn-sm ';
    if (!this.asButton) return '';
    if (!this.isAuth || this.user.id === this.currentUserId) {
      return `${base}btn-link text-decoration-none`;
    }
    if (this.friendIds.includes(this.user.id)) {
      return `${base}btn-success`;
    }
    return `${base}btn-secondary`;
  }
}
