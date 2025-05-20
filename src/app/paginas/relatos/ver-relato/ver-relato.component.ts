import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { ComentariosComponent } from '../../../componentes/comentarios/comentarios.component';
import { PuntuacionComponent } from '../../../componentes/puntuacion/puntuacion.component';
import { MensajeAlertaComponent } from '../../../componentes/comunes/mensaje-alerta/mensaje-alerta.component';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
import { AutenticacionService } from '../../../servicios/api-autenticacion/autenticacion.service';
import { Relato } from '../../../servicios/api-servicios/api.models';

@Component({
  selector: 'app-ver-relato',
  standalone: true,
  imports: [
    CommonModule,
    ComentariosComponent,
    PuntuacionComponent,
    MensajeAlertaComponent
  ],
  templateUrl: './ver-relato.component.html',
  styleUrls: ['./ver-relato.component.css']
})
export class VerRelatoComponent implements OnInit {
  relato: Relato | null = null;
  cargando = true;
  relatoId!: number;
  origen: string | null = null;

  // Paginación
  pages: string[] = [];
  currentPage = 0;
  pagesPerSpread = 2;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    public mensajeGlobal: MensajeGlobalService,
    private viewportScroller: ViewportScroller,
    public  authService: AutenticacionService
  ) {}

  ngOnInit(): void {
    this.updatePagesPerSpread();
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));
    this.origen = this.route.snapshot.queryParamMap.get('origen');
    const peticion =
      this.origen === 'publicado'
        ? this.apiService.getRelatoPorIdPublico(this.relatoId)
        : this.apiService.getRelatoPorId(this.relatoId);

    peticion.subscribe({
      next: (res) => {
        this.relato = res;
        this.setupPagination(res.contenido);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener el relato:', err);
        this.cargando = false;
        if (err.status === 403 || err.status === 404) {
          const redir = this.origen === 'publicado' ? '/relatos-publicados' : '/mis-relatos';
          this.router.navigate([redir]);
        }
      }
    });
  }

  get isAuthenticated(): boolean {
    return !!this.authService.isAuthenticated;
  }

  goToLogin(): void {
    const returnUrl = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnUrl } });
  }

  @HostListener('window:resize')
  onResize() {
    this.updatePagesPerSpread();
  }

  private updatePagesPerSpread() {
    this.pagesPerSpread = window.innerWidth < 992 ? 1 : 2;
    // ajusta currentPage si queda fuera de rango
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
        // Calcula la posición vertical del elemento y réstale 100 px
        const y = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else {
        // Fallback al top de la página
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
      blocks.slice(i, i + chunkSize).forEach(el => pageDiv.appendChild(el.cloneNode(true)));
      this.pages.push(pageDiv.innerHTML);
    }
  }
}
