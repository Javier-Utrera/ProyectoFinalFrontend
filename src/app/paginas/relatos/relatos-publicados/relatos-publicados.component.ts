import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatos-publicados',
  imports: [CommonModule,RouterModule],
  templateUrl: './relatos-publicados.component.html',
  styleUrl: './relatos-publicados.component.css'
})
export class RelatosPublicadosComponent implements OnInit {
  relatos: any[] = [];
  cargando = true;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getRelatosPublicados().subscribe({
      next: (res) => {
        this.relatos = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener relatos publicados:', err);
        this.cargando = false;
      }
    });
  }
}
