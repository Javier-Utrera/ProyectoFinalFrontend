import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { RouterModule } from '@angular/router';


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
  ) {}

  ngOnInit(): void {
    this.authService.estado$.subscribe((estado) => {
      this.estaAutenticado = estado;
    });
  }
  cerrarSesion(): void {
    this.authService.logoutUsuario().subscribe({
      next: (res) => {
        this.router.navigate(['/']);
      },
      error: () => {
        this.authService.cerrarSesion();
        this.router.navigate(['/']);
      }
    });
  }
}
