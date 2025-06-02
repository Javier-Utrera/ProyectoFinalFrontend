import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { RouterModule, Router } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-barra-navegacion',
  imports: [RouterModule],
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('wrapperMenu', { static: false }) wrapperMenu!: ElementRef<HTMLElement>;

  estaAutenticado = false;
  esAdmin = false;
  esModerador = false;
  usarOffcanvas = false;

  private readonly MOBILE_WIDTH = 992;
  private subs: Subscription[] = [];
  private resizeSub!: Subscription;

  constructor(
    private readonly authService: AutenticacionService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    this.subs.push(
      this.authService.estado$.subscribe(estado => {
        this.estaAutenticado = estado;
        if (!estado) this.esAdmin = this.esModerador = false;
        setTimeout(() => this.comprobarOverflow(), 0);
      })
    );
    this.subs.push(
      this.authService.currentUser$.subscribe(user => {
        if (user) {
          this.esAdmin = user.rol === 1;
          this.esModerador = user.rol === 3;
        }
        setTimeout(() => this.comprobarOverflow(), 0);
      })
    );
  }

  ngAfterViewInit(): void {
    // Comprobación inicial
    setTimeout(() => this.comprobarOverflow(), 0);

    // Debounce en resize
    this.resizeSub = fromEvent(window, 'resize')
      .pipe(debounceTime(20))
      .subscribe(() => this.comprobarOverflow());
  }

  private comprobarOverflow(): void {
    const anchoVentana = window.innerWidth;

    if (anchoVentana < this.MOBILE_WIDTH) {
      this.usarOffcanvas = true;
      return;
    }

    // Asumimos horizontal, luego medimos
    this.usarOffcanvas = false;
    setTimeout(() => {
      const contenedor = this.wrapperMenu?.nativeElement;
      if (!contenedor) {
        this.usarOffcanvas = true;
        return;
      }
      const ulElement = contenedor.querySelector('ul.navbar-nav') as HTMLElement;
      if (!ulElement) {
        this.usarOffcanvas = true;
        return;
      }
      const items = ulElement.querySelectorAll('li.nav-item');
      if (items.length) {
        const ultimo = items[items.length - 1] as HTMLElement;
        const rectUltimo = ultimo.getBoundingClientRect();
        const rectWrapper = contenedor.getBoundingClientRect();
        this.usarOffcanvas = rectUltimo.right > rectWrapper.right;
      }
    }, 0);
  }

  cerrarSesion(): void {
    this.authService.logoutUsuario().subscribe({
      next: () => this.router.navigate(['/']),
      error: () => {
        this.authService.cerrarSesion();
        this.router.navigate(['/']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.resizeSub.unsubscribe();
  }
}
