import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../editor/editor.component';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { Router } from '@angular/router';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { LibroCargaComponent } from "../comunes/libro-carga/libro-carga.component";
import { Relato } from '../../servicios/api-servicios/api.models';

@Component({
  selector: 'app-editor-fragmento',
  imports: [CommonModule, EditorComponent, LibroCargaComponent],
  templateUrl: './editor-fragmento.component.html',
  styleUrls: ['./editor-fragmento.component.css']
})
export class EditorFragmentoComponent implements OnInit {
  @Input() relatoId!: number;
  @Input() relato!: Relato;
  @Output() fragmentoListo = new EventEmitter<void>();

  contenidoHtml = '';
  orden!: number;
  listo = false;
  cargando = true;

  constructor(
    private api: ApiService,
    private msj: MensajeGlobalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.api.getMiFragmento(this.relatoId).subscribe({
      next: frag => {
        this.contenidoHtml = frag.contenido_fragmento || '';
        this.orden = frag.orden;
        this.listo = frag.listo_para_publicar;
        this.cargando = false;
      },
      error: () => {
        this.router.navigate(['/mis-relatos']);
      }
    });
  }

  guardarBorrador(): void {
    this.api.updateMiFragmento(this.relatoId, this.contenidoHtml).subscribe({
      next: () => {},
      error: () => {}
    });
  }

  async marcarComoListo(): Promise<void> {
    const relato = this.relato;
    const totalPrevisto = relato.num_escritores;
    const autoresActuales = relato.autores.length;
  
    let mensaje = '';
    let mostrarConfirm = false;
  
    if (autoresActuales === 1) {
      mensaje = 'Eres el único participante actualmente. Si marcas como listo, el relato se publicará inmediatamente. ¿Deseas continuar?';
      mostrarConfirm = true;
    } else if (autoresActuales === totalPrevisto) {
      mensaje = 'Ya están todos los participantes. Una vez marques como listo, no podrás editar tu fragmento. El relato se publicará en cuanto todos lo marquen como listo.' +
      '¿Deseas continuar?';
      mostrarConfirm = true;
    } else if (autoresActuales < totalPrevisto && autoresActuales > 1) {
      mensaje = 'Aún no se han unido todos los escritores previstos, pero si todos los actuales marcan como listo, el relato se publicará con los participantes actuales. ¿Deseas continuar?';
      mostrarConfirm = true;
    }
  
    let confirmar = true;
    if (mostrarConfirm) {
      confirmar = await this.msj.confirmar(mensaje);
    }
  
    if (!confirmar) {
      await this.api.updateMiFragmento(this.relato.id, this.contenidoHtml).toPromise();
      return;
    }
  
    await this.api.updateMiFragmento(this.relato.id, this.contenidoHtml).toPromise();
  
    this.api.markFragmentReady(this.relato.id).subscribe({
      next: () => {
        this.fragmentoListo.emit();
      }
    });
  }
  
}
