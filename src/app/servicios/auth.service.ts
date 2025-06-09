// src/app/servicios/auth.service.ts
import { Injectable, NgZone } from '@angular/core';
import { MensajeGlobalService } from './mensaje-global/mensaje-global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private googleLoaded = false;

  constructor(
    private ngZone: NgZone,
    private msj: MensajeGlobalService
  ) {}

  /**
   * Carga dinámicamente el SDK de Google Identity Services.
   * Devuelve una promesa que se resuelve cuando `google.accounts.id` esté disponible.
   * Muestra un toast de error si falla la carga.
   */
  loadGoogleSdk(): Promise<void> {
    if (this.googleLoaded || (window as any).google) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this.googleLoaded = true;
        this.ngZone.run(() => {
          resolve();
        });
      };
      script.onerror = (err) => {
        console.error('Error al cargar el SDK de Google:', err);
        this.ngZone.run(() => {
          this.msj.mostrar(
            'No se pudo cargar el SDK de Google. Por favor, inténtalo de nuevo más tarde.',
            'danger'
          );
        });
        reject(err);
      };
      document.body.appendChild(script);
    });
  }

  /**
   * Inicializa el botón de Google en el elemento con id=buttonId.
   * Muestra un toast de error si algo falla.
   */
  initGoogleButton(
    buttonId: string,
    callback: (response: any) => void
  ): void {
    this.loadGoogleSdk()
      .then(() => {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: '913233383670-uscdsdbjhkv5s6dero7ajilakj9ar03n.apps.googleusercontent.com',
            callback: (response: any) => {
              this.ngZone.run(() => callback(response));
            }
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById(buttonId),
            { theme: 'outline', size: 'large' }
          );
        } catch (e) {
          console.error('Error al inicializar el botón de Google:', e);
          this.ngZone.run(() => {
            this.msj.mostrar(
              'No se pudo inicializar el botón de Google.',
              'danger'
            );
          });
        }
      })
      .catch(() => {
      });
  }
}
