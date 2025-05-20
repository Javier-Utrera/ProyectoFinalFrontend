import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OpcionesRelato } from '../../servicios/api-servicios/api.models';
import { ApiService } from '../../servicios/api-servicios/api.service';

@Component({
  selector: 'app-buscador',
  imports: [ReactiveFormsModule],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css'
})
export class BuscadorComponent implements OnInit, OnChanges {
  @Input() numEscritoresOpts: number[] = [];
  @Input() initialFilters: any = {};
  @Output() paramsChange = new EventEmitter<any>();
  advancedOpen = false;

  form: FormGroup;

  idiomas: { value: string; label: string }[] = [];
  generos: { value: string; label: string }[] = [];

  constructor(
    private fb: FormBuilder,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      autor:           [''],
      titulo:          [''],
      descripcion:     [''],
      idioma:          [''],
      generos:         [''],
      num_escritores:  [''],
      desde:           [''],
      hasta:           [''],
      ordering:        ['-fecha_creacion']
    });
  }

  ngOnInit(): void {
    // 1) cargar idiomas y géneros 
    this.api.getOpcionesRelato().subscribe((opts: OpcionesRelato) => {
      this.idiomas = opts.idiomas.map(([v, l]) => ({ value: v, label: l }));
      this.generos = opts.generos.map(([v, l]) => ({ value: v, label: l }));
    });

    // 2) parchear valores iniciales
    this.patchForm(this.initialFilters);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['initialFilters'] && !changes['initialFilters'].firstChange) {
      this.patchForm(this.initialFilters);
    }
  }

  private patchForm(filters: any) {
    this.form.patchValue({
      autor:           filters['autor']                  || '',
      titulo:          filters['titulo__icontains']     || '',
      descripcion:     filters['descripcion__icontains']|| '',
      idioma:          filters['idioma']                || '',
      generos:         filters['generos']               || '',
      num_escritores:  filters['num_escritores']        || '',
      desde:           filters['fecha_creacion__gte']   || '',
      hasta:           filters['fecha_creacion__lte']   || '',
      ordering:        filters['ordering']              || '-fecha_creacion'
    });
  }

  onSubmit(): void {
    const vals = this.form.value;
    const p: any = {};
    if (vals.autor?.trim())       p['autor']                   = vals.autor.trim();
    if (vals.titulo?.trim())      p['titulo__icontains']       = vals.titulo.trim();
    if (vals.descripcion?.trim()) p['descripcion__icontains']  = vals.descripcion.trim();
    if (vals.idioma)              p['idioma']                  = vals.idioma;
    if (vals.generos)             p['generos']                 = vals.generos;
    if (vals.num_escritores)      p['num_escritores']          = vals.num_escritores;
    if (vals.desde)               p['fecha_creacion__gte']     = vals.desde;
    if (vals.hasta)               p['fecha_creacion__lte']     = vals.hasta;
    p['ordering'] = vals.ordering;
    p['page']     = 1;
    this.paramsChange.next(p);
  }

  toggleAdvanced(): void {
    this.advancedOpen = !this.advancedOpen;
  }
}
