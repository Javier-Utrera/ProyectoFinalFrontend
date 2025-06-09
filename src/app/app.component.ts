import { Component } from '@angular/core';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';
import { RouterOutlet } from '@angular/router';
import { MensajeAlertaComponent } from "./componentes/comunes/mensaje-alerta/mensaje-alerta.component";
import { PushNotificationsComponent } from "./componentes/comunes/push-notifications/push-notifications.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraNavegacionComponent, PiePaginaComponent, MensajeAlertaComponent, PushNotificationsComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookroom-front';
}
