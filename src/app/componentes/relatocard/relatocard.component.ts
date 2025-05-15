import { Component, Input } from '@angular/core';
import { EstadisticasRelatoComponent } from "../estadisticas-relato/estadisticas-relato.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-relatocard',
  imports: [EstadisticasRelatoComponent,CommonModule,RouterModule],
  templateUrl: './relatocard.component.html',
  styleUrl: './relatocard.component.css'
})
export class RelatoCardComponent {
  @Input() relato!: any;
  @Input() origen?: 'publicado' | 'disponible' | 'mis-relatos';
}
