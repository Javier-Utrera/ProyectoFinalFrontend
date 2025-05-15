import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { RelatoCardComponent } from "../../../componentes/relatocard/relatocard.component";
import { PaginatedResponse, Relato } from '../../../servicios/api-servicios/api.models';

@Component({
  selector: 'app-mis-relatos',
  imports: [CommonModule, RelatoCardComponent],
  templateUrl: './mis-relatos.component.html',
  styleUrl: './mis-relatos.component.css'
})
export class MisRelatosComponent implements OnInit {
  relatos: Relato[] = [];
  total = 0;
  cargando = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarRelatos();
  }

  private cargarRelatos(params: any = {}): void {
    this.cargando = true;
    this.apiService.getMisRelatos(params).subscribe({
      next: (res: PaginatedResponse<Relato>) => {
        this.relatos = res.results;
        this.total   = res.count;
        this.cargando = false;
      },
      error: err => {
        console.error('Error al obtener relatos:', err);
        this.cargando = false;
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
    this.apiService.marcarRelatoListo(id).subscribe({
      next: res => {
        console.log(res.mensaje);
        this.cargarRelatos(); // recargar
      },
      error: err => {
        console.error('Error al marcar como listo:', err);
      }
    });
  }

  eliminarRelato(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este relato?')) {
      this.apiService.eliminarRelato(id).subscribe({
        next: res => {
          console.log(res.mensaje);
          this.cargarRelatos(); // recargar
        },
        error: err => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}

