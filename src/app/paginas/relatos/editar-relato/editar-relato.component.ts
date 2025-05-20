import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { EditorFragmentoComponent } from '../../../componentes/editor-fragmento/editor-fragmento.component';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { Relato } from '../../../servicios/api-servicios/api.models';
import { AutenticacionService } from '../../../servicios/api-autenticacion/autenticacion.service';
import { CommonModule } from '@angular/common';
import { EditorComponent } from "../../../componentes/editor/editor.component";


@Component({
  selector: 'app-editar-relato',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorFragmentoComponent,
    EditorComponent
  ],
  templateUrl: './editar-relato.component.html',
  styleUrls: ['./editar-relato.component.css']
})
export class EditarRelatoComponent implements OnInit, OnDestroy {
  relatoId!: number;
  relato!: Relato;
  contenidoFinal: string = '';

  formularioMetas!: FormGroup;
  formularioFinal!: FormGroup;

  cargandoMetas = true;
  cargandoFinal = true;
  enviadoMetas = false;
  enviadoFinal = false;

  esCreador = false;
  esModAdmin = false;

  idiomas: { value: string; label: string }[] = [];
  generos: { value: string; label: string }[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private auth: AutenticacionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));
    this.verificarAutorizacion();

    forkJoin({
      opciones: this.apiService.getOpcionesRelato(),
      relato: this.apiService.getRelatoPorId(this.relatoId)
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ opciones, relato }) => {
        this.idiomas = opciones.idiomas.map(([v, l]) => ({ value: v, label: l }));
        this.generos = opciones.generos.map(([v, l]) => ({ value: v, label: l }));

        this.relato = relato;
        this.determineRoles();
        this.buildForms();

        this.cargandoMetas = false;
        this.cargandoFinal = false;
      },
      error: () => this.router.navigate(['/mis-relatos'])
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private verificarAutorizacion(): void {
    this.esModAdmin = this.auth.hasRole(1, 3);
  }

  private determineRoles(): void {
    const creador = this.relato.participaciones
      ?.find(p => p.orden === 1)?.usuario;
    const usuario = this.auth.currentUser;
    this.esCreador = !!usuario && usuario.id === creador;
  }

  private buildForms(): void {
    if (this.esCreador || this.esModAdmin) {
      this.formularioMetas = this.fb.group({
        titulo: [this.relato.titulo, [Validators.required, Validators.minLength(3)]],
        descripcion: [this.relato.descripcion, [Validators.required, Validators.minLength(10)]],
        idioma: [this.relato.idioma, [Validators.required]],
        generos: [this.relato.generos]
      });
    }

    if (this.esModAdmin) {
      this.contenidoFinal = this.relato.contenido || '';

      this.formularioFinal = this.fb.group({
        contenido: [this.contenidoFinal, [Validators.required, Validators.minLength(10)]]
      });
    }
  }

  onSubmitMetas(): void {
    this.enviadoMetas = true;
    if (this.formularioMetas.invalid) return;

    this.apiService.editarRelato(this.relatoId, this.formularioMetas.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => alert('Metadatos guardados correctamente'));
  }

  onSubmitFinal(): void {
    this.enviadoFinal = true;
    if (this.formularioFinal.invalid) return;

    this.formularioFinal.patchValue({ contenido: this.contenidoFinal });

    this.apiService.editarRelatoFinal(this.relatoId, this.formularioFinal.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => alert('Contenido final guardado correctamente'));
  }

  onFragmentoListo(): void {
    this.router.navigate(['/mis-relatos']);
  }
}
