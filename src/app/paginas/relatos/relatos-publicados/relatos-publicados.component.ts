import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { RelatoCardComponent } from '../../../componentes/relatocard/relatocard.component';
import { PaginatedResponse, Relato } from '../../../servicios/api-servicios/api.models';
import { BuscadorComponent } from "../../../componentes/buscador/buscador.component";

@Component({
  selector: 'app-relatos-publicados',
  imports: [CommonModule, RouterModule, RelatoCardComponent, BuscadorComponent],
  templateUrl: './relatos-publicados.component.html',
  styleUrl: './relatos-publicados.component.css'
})
export class RelatosPublicadosComponent implements OnInit {
  relatos: Relato[] = [];
  total = 0;
  cargando = true;
  currentPage = 1;

  private readonly pageSize = 5;
  filters: any = {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      // 1) Guardamos page y todos los filtros completos
      this.currentPage = queryParams['page'] ? +queryParams['page'] : 1;
      this.filters = { ...queryParams };

      // 2) Llamamos con TODO el objeto (incluye page)
      this.cargarRelatos(queryParams, false);
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  cargarRelatos(params: any = {}, pushUrl = true): void {
    this.cargando = true;

    const pageToLoad = params.page ? +params.page : 1;
    this.currentPage = pageToLoad;

    const { page, ...searchFilters } = params;

    // 3) Solo navegamos cuando pushUrl=true
    if (pushUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...searchFilters, page: this.currentPage }
      });
    }

    // 4) Petición al API con el page
    this.apiService
      .getRelatosPublicados({ ...searchFilters, page: this.currentPage })
      .subscribe({
        next: (res: PaginatedResponse<Relato>) => {
          this.relatos = res.results;
          this.total = res.count;
          this.cargando = false;
        },
        error: err => {
          console.error('Error al obtener relatos publicados:', err);
          this.cargando = false;
        }
      });
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.cargarRelatos({ ...this.filters, page: this.currentPage - 1 });
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.cargarRelatos({ ...this.filters, page: this.currentPage + 1 });
    }
  }

}
