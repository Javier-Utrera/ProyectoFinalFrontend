import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-inicio',
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  bienvenida: string = 'Bienvenido a BookRoom 🪶';

  constructor(private apiService: ApiService) {}


}
