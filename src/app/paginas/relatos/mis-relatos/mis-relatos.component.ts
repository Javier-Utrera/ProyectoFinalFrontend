// src/app/pages/mis-relatos/mis-relatos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { MensajeGlobalService } from '../../../servicios/mensaje-global/mensaje-global.service';
import { RelatoCardComponent } from "../../../componentes/relatocard/relatocard.component";
import { PaginatedResponse, Relato } from '../../../servicios/api-servicios/api.models';
import { BuscadorComponent } from "../../../componentes/buscador/buscador.component";
import { LibroCargaComponent } from "../../../componentes/comunes/libro-carga/libro-carga.component";

@Component({
  selector: 'app-mis-relatos',
  imports: [CommonModule, RelatoCardComponent, BuscadorComponent, LibroCargaComponent],
  templateUrl: './mis-relatos.component.html',
  styleUrls: ['./mis-relatos.component.css']
})
export class MisRelatosComponent implements OnInit {
  relatos: Relato[] = [];
  total = 0;
  loading = true;

  page = 1;
  private readonly itemsPerPage = 6;
  filtrosActivo: any = {};

  constructor(
    private api: ApiService,
    private msj: MensajeGlobalService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

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
    this.api.marcarRelatoListo(id)
      .subscribe({
        next: () => this.loadMisRelatos(),
        error: () => {
        }
      });
  }

  async eliminarRelato(id: number): Promise<void> {
    const confirmado = await this.msj.confirmar('¿Estás seguro de que quieres eliminar este relato?');
    if (!confirmado) return;

    this.api.eliminarRelato(id)
      .subscribe({
        next: () => this.loadMisRelatos(),
        error: () => {
        }
      });
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
