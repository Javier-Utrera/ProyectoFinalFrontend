import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MensajeGlobalService {
  mensaje: string | null = null;
  tipo: 'success' | 'danger' | 'info' | 'warning' = 'info';

  mostrar(mensaje: string, tipo: 'success' | 'danger' | 'info' | 'warning' = 'info') {
    this.limpiar();
  
    setTimeout(() => {
      this.tipo = tipo;
      this.mensaje = mensaje;
    }, 50);
  }

  limpiar() {
    this.mensaje = null;
  }
}
