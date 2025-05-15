import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { Estadistica } from '../../servicios/api-servicios/api.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estadisticas-relato',
  imports: [CommonModule],
  templateUrl: './estadisticas-relato.component.html',
  styleUrl: './estadisticas-relato.component.css'
})
export class EstadisticasRelatoComponent implements OnInit {
  @Input() relatoId!: number;
  estadistica?: Estadistica;
  cargando = false;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  private cargarEstadisticas(): void {
    this.cargando = true;
    this.api.getEstadisticasRelato(this.relatoId).subscribe({
      next: data => {
        this.estadistica = data;
        this.cargando = false;
      },
      error: () => {
        this.error = 'No se pudieron cargar las estadísticas.';
        this.cargando = false;
      }
    });
  }
}
