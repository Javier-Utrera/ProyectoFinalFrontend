import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { RelatoCardComponent } from "../../../componentes/relatocard/relatocard.component";
import { PaginatedResponse, Relato } from '../../../servicios/api-servicios/api.models';
import { BuscadorComponent } from "../../../componentes/buscador/buscador.component";

@Component({
  selector: 'app-relatos-disponibles',
  imports: [RelatoCardComponent, BuscadorComponent],
  templateUrl: './relatos-disponibles.component.html',
  styleUrl: './relatos-disponibles.component.css'
})
export class RelatosDisponiblesComponent implements OnInit {
  relatos: Relato[] = [];
  total = 0;
  loading = true;
  authenticated = false;

  // Paginación
  page = 1;
  private readonly itemsPerPage = 5;
  filtrosActivo: any = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.authenticated = !!localStorage.getItem('token');

    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      const { page, ...rest } = params;
      this.filtrosActivo = rest;
      this.loadRelatos(false);
    });
  }

  onBuscar(filtros: any): void {
    this.filtrosActivo = filtros;
    this.page = 1;
    this.loadRelatos();
  }

  loadRelatos(updateUrl = true): void {
    this.loading = true;
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...this.filtrosActivo, page: this.page }
      });
    }
    this.api.getRelatosDisponibles({ ...this.filtrosActivo, page: this.page })
      .subscribe({
        next: (res: PaginatedResponse<Relato>) => {
          this.relatos = res.results;
          this.total = res.count;
          this.loading = false;
        },
        error: err => {
          console.error('Error al cargar relatos disponibles:', err);
          this.loading = false;
        }
      });
  }

  unirse(id: number): void {
    if (!this.authenticated) {
      this.router.navigate(['/login'], {
        queryParams: { returnTo: this.router.url }
      });
      return;
    }
    this.api.unirseARelato(id).subscribe({
      next: res => {
        alert(res.mensaje);
        this.router.navigate(['/mis-relatos']);
      },
      error: err => {
        console.error('Error al unirse al relato:', err);
        alert('Error al unirse al relato.');
      }
    });
  }

  /** Paginación */
  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.itemsPerPage));
  }
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadRelatos();
    }
  }
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadRelatos();
    }
  }
}
