import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { RouterModule } from '@angular/router';
import Collapse from 'bootstrap/js/dist/collapse';

@Component({
  selector: 'app-barra-navegacion',
  imports: [RouterModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {
  estaAutenticado = false;
  esAdmin = false;
  esModerador = false;
  isCollapsed = true;

  private readonly MOBILE_WIDTH = 992;

  constructor(
    private authService: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.estado$.subscribe(estado => {
      this.estaAutenticado = estado;
      if (!estado) {
        this.esAdmin = this.esModerador = false;
      }
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.esAdmin      = user.rol === 1;
        this.esModerador = user.rol === 3;
      }
    });
  }

  toggleNavbar(): void {
    if (window.innerWidth < this.MOBILE_WIDTH) {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  closeNavbar(): void {
    if (window.innerWidth < this.MOBILE_WIDTH && !this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

  cerrarSesion(): void {
    this.authService.logoutUsuario().subscribe({
      next: ()    => this.router.navigate(['/']),
      error: ()   => {
        this.authService.cerrarSesion();
        this.router.navigate(['/']);
      }
    });
    this.closeNavbar();
  }
}

