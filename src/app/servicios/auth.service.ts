import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private googleLoaded = false;

  constructor(private ngZone: NgZone) {}

  /**
   * Carga dinámicamente el SDK de Google Identity Services.
   * Devuelve una promesa que se resuelve cuando `google.accounts.id` esté disponible.
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
        this.ngZone.run(() => resolve());
      };
      script.onerror = (err) => reject(err);
      document.body.appendChild(script);
    });
  }

  /**
   * Inicializa el botón de Google en el elemento con id=buttonId.
   * callback recibirá el objeto que Google envía con el id_token.
   */
  initGoogleButton(buttonId: string, callback: (response: any) => void): void {
    this.loadGoogleSdk()
      .then(() => {
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
      })
      .catch(err => {
        console.error('No se pudo cargar el SDK de Google:', err);
      });
  }
}
