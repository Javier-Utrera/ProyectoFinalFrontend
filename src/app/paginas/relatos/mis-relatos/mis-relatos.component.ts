import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-mis-relatos',
  imports: [CommonModule],
  templateUrl: './mis-relatos.component.html',
  styleUrl: './mis-relatos.component.css'
})
export class MisRelatosComponent implements OnInit {
  relatos: any[] = [];
  cargando = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apiService.getMisRelatos().subscribe({
      next: (res) => {
        this.relatos = res;
        this.cargando = false;
      },
      error: (err) => {
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
      next: (res) => {
        console.log(res.mensaje);
        this.ngOnInit(); // recargar
      },
      error: (err) => {
        console.error('Error al marcar como listo:', err);
      }
    });
  }

  eliminarRelato(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este relato?')) {
      this.apiService.eliminarRelato(id).subscribe({
        next: (res) => {
          console.log(res.mensaje);
          this.ngOnInit(); // recargar
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}

