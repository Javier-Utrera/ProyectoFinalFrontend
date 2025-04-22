import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-inicio',
  imports: [],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  bienvenida: string = 'Bienvenido a BookRoom Script 🪶';

  constructor(private apiService: ApiService) {}


}
