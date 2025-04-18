import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-relatos-disponibles',
  imports: [CommonModule],
  templateUrl: './relatos-disponibles.component.html',
  styleUrl: './relatos-disponibles.component.css'
})
export class RelatosDisponiblesComponent implements OnInit {
  relatos: any[] = [];
  cargando = true;
  autenticado = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.autenticado = !!localStorage.getItem('token');

    this.apiService.getRelatosAbiertos().subscribe({
      next: (res) => {
        this.relatos = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar relatos abiertos:', err);
        this.cargando = false;
      }
    });
  }

  unirse(id: number): void {
    if (!this.autenticado) {
      this.router.navigate(['/login'], {
        queryParams: { returnTo: this.router.url }
      });
      return;
    }

    this.apiService.unirseARelato(id).subscribe({
      next: (res) => {
        alert(res.mensaje);
        this.router.navigate(['/mis-relatos']);
      },
      error: (err) => {
        console.error('Error al unirse al relato:', err);
        alert('Error al unirse al relato.');
      }
    });
  }
}
