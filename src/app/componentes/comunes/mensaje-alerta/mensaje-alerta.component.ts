import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mensaje-alerta',
  imports: [],
  templateUrl: './mensaje-alerta.component.html',
  styleUrl: './mensaje-alerta.component.css'
})
export class MensajeAlertaComponent {
  @Input() mensaje: string | null = null;
  @Input() tipo: 'success' | 'danger' | 'info' | 'warning' = 'info';

  cerrar(): void {
    this.mensaje = null;
  }
}
