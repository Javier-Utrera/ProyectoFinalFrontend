import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { RelatoCardComponent } from "../../../componentes/relatocard/relatocard.component";
import { PaginatedResponse, Relato } from '../../../servicios/api-servicios/api.models';
import { BuscadorComponent } from "../../../componentes/buscador/buscador.component";

@Component({
  selector: 'app-mis-relatos',
  imports: [CommonModule, RelatoCardComponent, BuscadorComponent],
  templateUrl: './mis-relatos.component.html',
  styleUrl: './mis-relatos.component.css'
})
export class MisRelatosComponent implements OnInit {
  relatos: Relato[] = [];
  total = 0;
  loading = true;

  page = 1;
  private readonly itemsPerPage = 5;
  filtrosActivo: any = {};

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = params['page'] ? +params['page'] : 1;
      const { page, ...rest } = params;
      this.filtrosActivo = rest;
      this.loadMisRelatos(false);
    });
  }

  onBuscar(filtros: any): void {
    this.filtrosActivo = filtros;
    this.page = 1;
    this.loadMisRelatos();
  }

  loadMisRelatos(updateUrl = true): void {
    this.loading = true;
    if (updateUrl) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { ...this.filtrosActivo, page: this.page }
      });
    }
    this.api.getMisRelatos({ ...this.filtrosActivo, page: this.page })
      .subscribe({
        next: (res: PaginatedResponse<Relato>) => {
          this.relatos = res.results;
          this.total = res.count;
          this.loading = false;
        },
        error: () => {
          console.error('Error al obtener mis relatos');
          this.loading = false;
        }
      });
  }

  verRelato(id: number): void {
    this.router.navigate(['/relato', id]);
  }

  editarRelato(id: number): void {
    this.router.navigate(['/relato', id, 'editar']);
  }

  marcarListo(id: number): void {
    this.api.marcarRelatoListo(id).subscribe({
      next: res => {
        console.log(res.mensaje);
        this.loadMisRelatos(); // recargar
      },
      error: err => {
        console.error('Error al marcar como listo:', err);
      }
    });
  }

  eliminarRelato(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este relato?')) {
      this.api.eliminarRelato(id).subscribe({
        next: res => {
          console.log(res.mensaje);
          this.loadMisRelatos(); // recargar
        },
        error: err => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.total / this.itemsPerPage));
  }
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.loadMisRelatos();
    }
  }
  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.loadMisRelatos();
    }
  }
}

