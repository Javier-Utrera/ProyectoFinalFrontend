import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-mensaje',
  imports: [CommonModule],
  templateUrl: './modal-mensaje.component.html',
  styleUrl: './modal-mensaje.component.css'
})
export class ModalMensajeComponent {
  @Input() mensaje: string = '';
}
