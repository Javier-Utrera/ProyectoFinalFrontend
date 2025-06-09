import { Component, OnInit } from '@angular/core';
import { MensajeGlobalService, ModalConfig } from '../../../servicios/mensaje-global/mensaje-global.service';

interface ToastItem {
  id: number;
  mensaje: string;
  tipo: 'success' | 'danger' | 'info' | 'warning';
}

@Component({
  selector: 'app-push-notifications',
  imports: [],
  templateUrl: './push-notifications.component.html',
  styleUrl: './push-notifications.component.css'
})
export class PushNotificationsComponent implements OnInit {
  toasts: ToastItem[] = [];
  containerPos: 'start-0' | 'end-0' = 'end-0';

  constructor(private msj: MensajeGlobalService) {}

  ngOnInit() {
    this.msj.toastState$.subscribe((cfg: ModalConfig) => {
      const id = Date.now();
      this.toasts.push({ id, mensaje: cfg.mensaje, tipo: cfg.tipo });
      this.containerPos = (cfg.tipo === 'success' || cfg.tipo === 'info') ? 'end-0' : 'start-0';
      setTimeout(() => this.remove(id), 4000);
    });
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
