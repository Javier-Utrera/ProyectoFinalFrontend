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
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      // Página actual (por defecto 1)
      const page = queryParams['page'] ? + queryParams['page'] : 1;
      this.currentPage = page;
  
      // Extraemos todos los filtros menos la página
      const { page: _, ...filters } = queryParams;
      this.filters = filters; 
  
      // Cargamos los relatos sin actualizar la URL
      this.cargarRelatos(filters, false);
    });
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.pageSize));
  }

  /**
   * @param params fltros  
   * @param pushUrl controla si actualizamos la URL
   */
  cargarRelatos(filters: any = {}, pushUrl = true): void {
    this.cargando = true;
  
    // 1) Calcula la página a cargar 
    const pageToLoad = filters.page != null ? +filters.page : 1;
    this.currentPage = pageToLoad;
  
    // 2) Separa 'page' de los filtros para no duplicar
    const { page, ...searchFilters } = filters;
  
    // 3) Actualiza la URL (reemplazando TODOS los params)
    if (pushUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          ...searchFilters,
          page: this.currentPage
        }
      });
    }
  
    // 4) Llama al API con la página que querems
    this.apiService
      .getRelatosPublicados({
        ...searchFilters,
        page: this.currentPage
      })
      .subscribe({
        next: (res: PaginatedResponse<Relato>) => {
          this.relatos = res.results;
          this.total   = res.count;
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
      this.currentPage--;
      this.cargarRelatos({ ...this.filters, page: this.currentPage });
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.cargarRelatos({ ...this.filters, page: this.currentPage });
    }
  }
  
}
