import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../editor/editor.component';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-editor-fragmento',
  standalone: true,
  imports: [CommonModule, EditorComponent],
  templateUrl: './editor-fragmento.component.html',
  styleUrls: ['./editor-fragmento.component.css']
})
export class EditorFragmentoComponent implements OnInit {
  @Input() relatoId!: number;
  @Output() fragmentoListo = new EventEmitter<void>();

  contenidoHtml: string = '';
  orden!: number;
  listo: boolean = false;
  cargando: boolean = true;

  constructor(
    private api: ApiService,
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
        console.error('Error al cargar el fragmento');
        this.router.navigate(['/mis-relatos']);
      }
    });
  }

  guardarBorrador(): void {
    this.api.updateMiFragmento(this.relatoId, this.contenidoHtml).subscribe({
      next: () => alert('Borrador guardado correctamente'),
      error: err => console.error('Error guardando borrador', err)
    });
  }

  marcarListo(): void {
    this.api.markFragmentReady(this.relatoId).subscribe({
      next: () => {
        this.listo = true;
        alert('Fragmento marcado como listo');
        this.fragmentoListo.emit();
      },
      error: err => console.error('Error marcando listo', err)
    });
  }
}
