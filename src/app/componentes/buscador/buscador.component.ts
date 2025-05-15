import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador',
  imports: [ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent implements OnInit, OnChanges {
  @Input() idiomas: string[] = [];
  @Input() numEscritoresOpts: number[] = [];
  /** Recibe los filtros actuales de la URL */
  @Input() initialFilters: any = {};
  @Output() paramsChange = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      titulo:         [''],
      descripcion:    [''],
      idioma:         [''],
      num_escritores: [''],
      desde:          [''],
      hasta:          [''],
      ordering:       ['-fecha_creacion']
    });
  }

  ngOnInit(): void {
    this.patchForm(this.initialFilters);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialFilters'] && !changes['initialFilters'].firstChange) {
      this.patchForm(this.initialFilters);
    }
  }

  private patchForm(filters: any) {
    this.form.patchValue({
      titulo:         filters['titulo__icontains']      || '',
      descripcion:    filters['descripcion__icontains'] || '',
      idioma:         filters['idioma']                 || '',
      num_escritores: filters['num_escritores']         || '',
      desde:          filters['fecha_creacion__gte']    || '',
      hasta:          filters['fecha_creacion__lte']    || '',
      ordering:       filters['ordering']               || '-fecha_creacion'
    });
  }

  /** Se llama al pulsar el botón Buscar */
  onSubmit(): void {
    const vals = this.form.value;
    const p: any = {};

    if (vals.titulo?.trim())        p['titulo__icontains']      = vals.titulo.trim();
    if (vals.descripcion?.trim())   p['descripcion__icontains'] = vals.descripcion.trim();
    if (vals.idioma)                p['idioma']                 = vals.idioma;
    if (vals.num_escritores)        p['num_escritores']         = vals.num_escritores;
    if (vals.desde)                 p['fecha_creacion__gte']    = vals.desde;
    if (vals.hasta)                 p['fecha_creacion__lte']    = vals.hasta;

    p['ordering'] = vals.ordering;
    p['page']     = 1;

    this.paramsChange.next(p);
  }
}
