import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ModalConfig {
  mensaje: string;
  tipo: 'success' | 'danger' | 'info' | 'warning';
  isConfirm: boolean;
  resolver?: (confirmado: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class MensajeGlobalService {
  // Para confirmaciones (modal)
  private modalSubject = new Subject<ModalConfig>();
  modalState$: Observable<ModalConfig> = this.modalSubject.asObservable();

  // Para mensajes rápidos (toasts)
  private toastSubject = new Subject<ModalConfig>();
  toastState$: Observable<ModalConfig> = this.toastSubject.asObservable();

  /** Emite un toast y se autocierra tras 3s */
  mostrar(mensaje: string, tipo: 'success'|'danger'|'info'|'warning' = 'info') {
    this.toastSubject.next({ mensaje, tipo, isConfirm: false });
  }

  /** Abre un modal de confirmación y resuelve la promesa según respuesta */
  confirmar(mensaje: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.modalSubject.next({ mensaje, tipo: 'warning', isConfirm: true, resolver: resolve });
    });
  }
}
