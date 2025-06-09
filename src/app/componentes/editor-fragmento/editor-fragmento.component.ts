import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../editor/editor.component';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { Router } from '@angular/router';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';
import { LibroCargaComponent } from "../comunes/libro-carga/libro-carga.component";

@Component({
  selector: 'app-editor-fragmento',
  imports: [CommonModule, EditorComponent, LibroCargaComponent],
  templateUrl: './editor-fragmento.component.html',
  styleUrls: ['./editor-fragmento.component.css']
})
export class EditorFragmentoComponent implements OnInit {
  @Input() relatoId!: number;
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

  marcarListo(): void {
    this.api.updateMiFragmento(this.relatoId, this.contenidoHtml, true).subscribe({
      next: () => {
        this.api.markFragmentReady(this.relatoId).subscribe({
          next: () => {
            this.listo = true;
            this.fragmentoListo.emit();
          },
          error: () => {}
        });
      },
      error: () => {}
    });
  }
}
