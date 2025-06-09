import { Component, OnInit } from '@angular/core';
import { CommonModule }       from '@angular/common';
import { RouterModule }       from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { CardModule }         from '@coreui/angular';
import { Chart, registerables } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import { ApiService }         from '../../../servicios/api-servicios/api.service';
import { DashboardStats }     from '../../../servicios/api-servicios/api.models';

Chart.register(...registerables);

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    BaseChartDirective,
    CardModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  summary!: DashboardStats;

  // Métricas numéricas
  metrics: Array<{ label: string; value: string }> = [];

  // Doughnuts
  rolesData!: ChartData<'doughnut', number[], string>;
  relatosData!: ChartData<'doughnut', number[], string>;
  subsData!:   ChartData<'doughnut', number[], string>;

  // Línea usuarios
  usersLineData!: ChartData<'line', number[], string>;

  // Barras de acciones
  accionesBarData!: ChartData<'bar', number[], string>;

  // “Ingresos” simple: mes vs total
  revenueLineData!: ChartData<'line', number[], string>;

  // Radar
  radarData!: ChartData<'radar', number[], string>;

  // Opciones
  doughnutOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1
  };
  lineOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: false } },
      y: { beginAtZero: true }
    }
  };
  barOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: false } },
      y: { beginAtZero: true }
    },
    plugins: { legend: { display: false } }
  };
  radarOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { r: { beginAtZero: true } }
  };

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getDashboardStats().subscribe(d => {
      this.summary = d;

      // Métricas principales
      this.metrics = [
        { label: 'Usuarios totales',    value: `${d.usuarios.total}` },
        { label: 'Usuarios (7d)',       value: `${d.usuarios.nuevos_7d}` },
        { label: 'Relatos totales',     value: `${d.relatos.total}` },
        { label: 'Participaciones',     value: `${d.participaciones}` },
        { label: 'Comentarios',         value: `${d.comentarios.total}` },
        { label: 'Votos relatos',       value: `${d.votos_relatos.total}` },
        { label: 'Mensajes',            value: `${d.mensajes}` },
        { label: 'Facturas mes',        value: `${d.facturas.ult_mes.cantidad}` },
        { label: 'Ingresos mes',        value: `${d.facturas.ult_mes.ingreso.toFixed(2)} €` }
      ];

      // Doughnut: usuarios por rol
      this.rolesData = {
        labels: Object.keys(d.usuarios.por_rol),
        datasets: [{
          data: Object.values(d.usuarios.por_rol),
          label: 'Roles'
        }]
      };

      // Doughnut: relatos por estado
      this.relatosData = {
        labels: Object.keys(d.relatos.por_estado),
        datasets: [{
          data: Object.values(d.relatos.por_estado),
          label: 'Estados relatos'
        }]
      };

      // Doughnut: suscripciones por tipo
      this.subsData = {
        labels: Object.keys(d.suscripciones.por_tipo),
        datasets: [{
          data: Object.values(d.suscripciones.por_tipo),
          label: 'Suscripciones'
        }]
      };

      // Línea: total usuarios vs nuevos 7d
      this.usersLineData = {
        labels: ['Total', 'Últimos 7d'],
        datasets: [{
          data: [d.usuarios.total, d.usuarios.nuevos_7d],
          label: 'Usuarios',
          fill: true,
          tension: 0.4
        }]
      };

      // Barras: acciones verticales
      const totalAmistades = Object.values(d.amistades).reduce((a,b)=>a+b,0);
      this.accionesBarData = {
        labels: ['Part.', 'Com.', 'Votos', 'Mens.', 'Amist.', 'Facturas'],
        datasets: [{
          data: [
            d.participaciones,
            d.comentarios.total,
            d.votos_relatos.total,
            d.mensajes,
            totalAmistades,
            d.facturas.ult_mes.cantidad
          ],
          backgroundColor: 'rgba(13,110,253,0.6)'
        }]
      };

      // Ingresos: mes vs total
      this.revenueLineData = {
        labels: ['Último mes','Total acumulado'],
        datasets: [{
          data: [d.facturas.ult_mes.ingreso, d.facturas.total.ingreso],
          label: '€ Ingresos',
          fill: false,
          borderColor: 'rgba(220,53,69,1)',
          tension: 0.3
        }]
      };

      // Radar: estrella de 5
      this.radarData = {
        labels: ['Usuarios','Relatos','Amistades','Mensajes','Participaciones'],
        datasets: [{
          label: 'Resumen',
          data: [
            d.usuarios.total,
            d.relatos.total,
            totalAmistades,
            d.mensajes,
            d.participaciones
          ]
        }]
      };
    });
  }
}
