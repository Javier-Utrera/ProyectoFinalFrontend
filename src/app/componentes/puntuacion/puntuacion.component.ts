import { Component, Input, OnInit } from '@angular/core';

import { ApiService } from '../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-puntuacion',
  imports: [],
  templateUrl: './puntuacion.component.html',
  styleUrl: './puntuacion.component.css'
})
export class PuntuacionComponent implements OnInit {
  @Input() relatoId!: number;

  miPuntuacion = 0;
  hover = 0;

  constructor(
    private api: ApiService,
    public mensajeGlobal: MensajeGlobalService,
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mensajeGlobal.limpiar();
  
    if (this.authService.isAuthenticated) {
      this.api.getMiVoto(this.relatoId).subscribe({
        next: voto => {
          this.miPuntuacion = voto?.puntuacion ?? 0;
        },
        error: err => {
          console.error('Error al recuperar mi voto:', err);
          this.miPuntuacion = 0;
        }
      });
    }
  }

  votar(p: number): void {
    // Si no hay token, redirigimos a login (guardando la URL de retorno)
    if (!this.authService.isAuthenticated) {
      const returnUrl = this.router.url;
      this.router.navigate(['/login'], { queryParams: { returnUrl } });
      return;
    }

    // Si está autenticado, hacemos la petición normalmente
    this.api.votarRelato(this.relatoId, p).subscribe({
      next: voto => {
        this.miPuntuacion = voto.puntuacion;
        this.mensajeGlobal.mostrar('Voto registrado correctamente', 'success');
      },
      error: err => {
        const msg = err.error?.error || 'Error al enviar el voto';
        this.mensajeGlobal.mostrar(msg, 'danger');
      }
    });
  }
}
