import { Component } from '@angular/core';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraNavegacionComponent, PiePaginaComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookroom-front';
}
