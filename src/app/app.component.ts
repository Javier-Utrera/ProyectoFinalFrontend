import { Component } from '@angular/core';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { PiePaginaComponent } from './componentes/pie-pagina/pie-pagina.component';
import { ModalMensajeComponent } from './componentes/modal-mensaje/modal-mensaje.component';
import { MensajeService } from './servicios/mensaje.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BarraNavegacionComponent, PiePaginaComponent,ModalMensajeComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'bookroom-front';
  mensajeGlobal: string | null = null;

  constructor(private mensajeService: MensajeService) {}

  ngOnInit(): void {
    this.mensajeService.mensaje$.subscribe((mensaje) => {
      this.mensajeGlobal = mensaje;
    });
  }
}
