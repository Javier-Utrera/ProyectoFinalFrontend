import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MensajeService {
  private mensajeSubject = new BehaviorSubject<string | null>(null);

  mensaje$: Observable<string | null> = this.mensajeSubject.asObservable();

  mostrar(mensaje: string): void {
    this.mensajeSubject.next(mensaje);
    setTimeout(() => this.mensajeSubject.next(null), 1500);
  }
}
