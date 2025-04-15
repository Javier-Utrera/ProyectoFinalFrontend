import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { RouterModule } from '@angular/router';
import { MensajeService } from '../../servicios/mensajes-emergentes/mensaje.service';


@Component({
  selector: 'app-barra-navegacion',
  imports: [RouterModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {
  estaAutenticado: boolean = false;

  constructor(
    private authService: AutenticacionService,
    private router: Router,
    private mensajeService: MensajeService
  ) {}

  ngOnInit(): void {
    this.authService.estado$.subscribe((estado) => {
      this.estaAutenticado = estado;
    });
  }
  cerrarSesion(): void {
    this.authService.logoutUsuario().subscribe({
      next: (res) => {
        this.mensajeService.mostrar(res.mensaje || 'Sesión cerrada correctamente.');
        this.router.navigate(['/']);
      },
      error: () => {
        this.authService.cerrarSesion();
        this.mensajeService.mostrar('Sesión cerrada localmente.');
        this.router.navigate(['/']);
      }
    });
  }
}
