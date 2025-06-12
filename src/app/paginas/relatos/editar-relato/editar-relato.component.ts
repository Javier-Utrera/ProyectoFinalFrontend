import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { EditorFragmentoComponent } from '../../../componentes/editor-fragmento/editor-fragmento.component';
import { filter, forkJoin, Subject, take, takeUntil } from 'rxjs';
import { ParticipacionRelato, Relato } from '../../../servicios/api-servicios/api.models';
import { AutenticacionService } from '../../../servicios/api-autenticacion/autenticacion.service';
import { CommonModule } from '@angular/common';
import { EditorComponent } from '../../../componentes/editor/editor.component';
import { ChatComponent } from '../../../componentes/chat/chat.component';
import { LibroCargaComponent } from "../../../componentes/comunes/libro-carga/libro-carga.component";

@Component({
  selector: 'app-editar-relato',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorFragmentoComponent,
    EditorComponent,
    ChatComponent,
    LibroCargaComponent
],
  templateUrl: './editar-relato.component.html',
  styleUrls: ['./editar-relato.component.css']
})
export class EditarRelatoComponent implements OnInit, OnDestroy {
  relatoId!: number;
  relato!: Relato;
  contenidoFinal = '';

  formularioMetas!: FormGroup;
  formularioFinal!: FormGroup;

  cargandoMetas = true;
  cargandoFinal = true;
  enviadoMetas = false;
  enviadoFinal = false;

  esCreador = false;
  esModAdmin = false;
  esColaborador = false;

  idiomas: { value: string; label: string }[] = [];
  generos: { value: string; label: string }[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private apiService: ApiService,
    private auth: AutenticacionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));

    this.auth.currentUser$
      .pipe(
        takeUntil(this.destroy$),
        filter(usuario => !!usuario),
        take(1)
      )
      .subscribe(() => {
        this.inicializarDatos();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarDatos(): void {
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
        error: () => {
          this.cargandoMetas = false;
          this.router.navigate(['/mis-relatos']);
        }
      });
  }

  private verificarAutorizacion(): void {
    this.esModAdmin = this.auth.hasRole(1, 3);
  }

  private determineRoles(): void {
    const usuarioActual = this.auth.currentUser!;
    const pCreador = this.relato.participaciones.find(
      (p: ParticipacionRelato) => p.orden === 1
    );
    this.esCreador = !!pCreador && pCreador.usuario === usuarioActual.id;
    this.esColaborador = this.relato.participaciones.some(
      (p: ParticipacionRelato) => p.usuario === usuarioActual.id
    );
  }

  private buildForms(): void {
    if (this.esCreador || this.esModAdmin) {
      this.formularioMetas = this.fb.group({
        titulo: [this.relato.titulo, [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
        descripcion: [this.relato.descripcion, [Validators.required, Validators.minLength(10)]],
        idioma: [this.relato.idioma, [Validators.required]],
        generos: [this.relato.generos]
      });
    }

    if (this.esModAdmin) {
      this.contenidoFinal = this.relato.contenido || '';
      this.formularioFinal = this.fb.group({
        contenido: [this.contenidoFinal]
      });
    }
  }

  onSubmitMetas(): void {
    this.enviadoMetas = true;
    if (this.formularioMetas.invalid) {
      return;
    }

    this.apiService
      .editarRelato(this.relatoId, this.formularioMetas.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.enviadoMetas = false;
        },
        error: () => {
          this.enviadoMetas = false;
        }
      });
  }

  onSubmitFinal(): void {
    this.enviadoFinal = true;
    if (this.formularioFinal.invalid) {
      return;
    }

    this.formularioFinal.patchValue({ contenido: this.contenidoFinal });
    this.apiService
      .editarRelatoFinal(this.relatoId, this.formularioFinal.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.enviadoFinal = false;
        },
        error: () => {
          this.enviadoFinal = false;
        }
      });
  }

  onFragmentoListo(): void {
    this.router.navigate(['/mis-relatos']);
  }

  chatExpanded = false;
  toggleChat(): void {
    this.chatExpanded = !this.chatExpanded;
  }
}
