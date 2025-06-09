import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { ComentariosComponent } from '../../../componentes/comentarios/comentarios.component';
import { PuntuacionComponent } from '../../../componentes/puntuacion/puntuacion.component';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
import { AutenticacionService } from '../../../servicios/api-autenticacion/autenticacion.service';
import { Relato } from '../../../servicios/api-servicios/api.models';
import { LibroCargaComponent } from "../../../componentes/comunes/libro-carga/libro-carga.component";
import { take } from 'rxjs';

@Component({
  selector: 'app-ver-relato',
  standalone: true,
  imports: [
    CommonModule,
    ComentariosComponent,
    PuntuacionComponent,
    LibroCargaComponent
  ],
  templateUrl: './ver-relato.component.html',
  styleUrls: ['./ver-relato.component.css']
})
export class VerRelatoComponent implements OnInit {
  relato: Relato | null = null;
  cargando = true;
  relatoId!: number;
  origen: string | null = null;

  pages: string[] = [];
  currentPage = 0;
  pagesPerSpread = 2;

  esColaborador = false;
  usuarioId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly router: Router,
    public mensajeGlobal: MensajeGlobalService,
    private readonly viewportScroller: ViewportScroller,
    public authService: AutenticacionService
  ) { }

  ngOnInit(): void {
    this.updatePagesPerSpread();
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));
    this.origen = this.route.snapshot.queryParamMap.get('origen');
    const peticion = this.origen === 'publicado'
      ? this.apiService.getRelatoPorIdPublico(this.relatoId)
      : this.apiService.getRelatoPorId(this.relatoId);

    peticion.subscribe({
      next: res => {
        this.relato = res;
        this.setupPagination(res.contenido ?? '');
        this.authService.currentUser$
          .pipe(take(1))
          .subscribe(usuario => {
            this.usuarioId = usuario?.id ?? null;
            // solo si el usuario está autenticado y el relato tiene autores cargados
            if (this.usuarioId && this.relato?.participaciones) {
              this.esColaborador = this.relato.participaciones.some(p => p.usuario === this.usuarioId);
            }
          });
        this.cargando = false;
      },
      error: err => {
        this.cargando = false;
        if (err.status === 403 || err.status === 404) {
          const redir = this.origen === 'publicado'
            ? '/relatos-publicados'
            : '/mis-relatos';
          this.router.navigate([redir]);
        }
      }
    });
  }

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated;
  }

  goToLogin(): void {
    const returnUrl = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }

  @HostListener('window:resize') onResize() {
    this.updatePagesPerSpread();
  }

  private updatePagesPerSpread() {
    this.pagesPerSpread = window.innerWidth < 992 ? 1 : 2;
    const maxStart = Math.max(0, this.pages.length - this.pagesPerSpread);
    if (this.currentPage > maxStart) {
      this.currentPage = maxStart;
    }
  }

  get pagesToShow(): string[] {
    return this.pages.slice(
      this.currentPage,
      this.currentPage + this.pagesPerSpread
    );
  }

  prevSpread() {
    if (this.currentPage > 0) {
      this.currentPage -= this.pagesPerSpread;
      if (this.currentPage < 0) this.currentPage = 0;
      this.scrollToSpread();
    }
  }

  nextSpread() {
    if (this.currentPage + this.pagesPerSpread < this.pages.length) {
      this.currentPage += this.pagesPerSpread;
      this.scrollToSpread();
    }
  }

  private scrollToSpread() {
    setTimeout(() => {
      const el = document.getElementById('spread');
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        this.viewportScroller.scrollToPosition([0, 0]);
      }
    }, 50);
  }

  private setupPagination(html: string) {
    const container = document.createElement('div');
    container.innerHTML = html;
    const blocks = Array.from(
      container.querySelectorAll('p, h2, h3, h4, blockquote, ul, ol')
    );
    const chunkSize = 10;
    for (let i = 0; i < blocks.length; i += chunkSize) {
      const pageDiv = document.createElement('div');
      blocks.slice(i, i + chunkSize)
        .forEach(el => pageDiv.appendChild(el.cloneNode(true)));
      this.pages.push(pageDiv.innerHTML);
    }
  }
}
