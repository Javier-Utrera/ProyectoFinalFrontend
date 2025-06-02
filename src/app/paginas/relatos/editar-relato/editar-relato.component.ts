import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../servicios/api-servicios/api.service';
import { EditorFragmentoComponent } from '../../../componentes/editor-fragmento/editor-fragmento.component';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { ParticipacionRelato, Relato } from '../../../servicios/api-servicios/api.models';
import { AutenticacionService } from '../../../servicios/api-autenticacion/autenticacion.service';
import { CommonModule } from '@angular/common';
import { EditorComponent } from "../../../componentes/editor/editor.component";
import { ChatComponent } from "../../../componentes/chat/chat.component";

@Component({
  selector: 'app-editar-relato',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EditorFragmentoComponent,
    EditorComponent,
    ChatComponent
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
  ) { }

  ngOnInit(): void {
    // 1) Leer el parámetro “id” de la ruta
    this.relatoId = Number(this.route.snapshot.paramMap.get('id'));

    // 2) Suscribirse a currentUser$ para esperar a que el usuario se cargue desde el token
    this.auth.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(usuario => {
        if (usuario) {
          this.inicializarDatos();
        } else {
          console.log('Esperando a que se cargue el usuario...');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Una vez que hay usuario en memoria, hacemos forkJoin de opciones y relato,
   * luego determinamos roles y construimos formularios.
   */
  private inicializarDatos(): void {
    // 3) Verificar si el usuario es moderador/administrador
    this.verificarAutorizacion();

    // 4) Llamar simultáneamente a getOpcionesRelato() y getRelatoPorId()
    forkJoin({
      opciones: this.apiService.getOpcionesRelato(),
      relato: this.apiService.getRelatoPorId(this.relatoId)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ opciones, relato }) => {
          // 5) Transformar opciones (idiomas y géneros)
          this.idiomas = opciones.idiomas.map(([v, l]) => ({ value: v, label: l }));
          this.generos = opciones.generos.map(([v, l]) => ({ value: v, label: l }));

          // 6) Asignar el objeto Relato
          this.relato = relato;

          // 7) Determinar roles (creador/colaborador) basándonos en participaciones
          this.determineRoles();

          // 8) Construir formularios (sólo si el usuario es creador o moderador)
          this.buildForms();

          // 9) Marcar como cargado (para que la plantilla deje de mostrar spinner)
          this.cargandoMetas = false;
          this.cargandoFinal = false;
        },
        error: (err) => {
          console.error('forkJoin ERROR:', err);
          this.cargandoMetas = false;
          // Redirigir o mostrar mensaje de error
          this.router.navigate(['/mis-relatos']);
        }
      });
  }

  /**
   * Marca esModAdmin = true si el usuario tiene rol 1 (administrador) o 3 (moderador).
   */
  private verificarAutorizacion(): void {
    this.esModAdmin = this.auth.hasRole(1, 3);
  }

  /**
   * Determina esCreador y esColaborador en base a las participaciones numéricas.
   */
  private determineRoles(): void {
    const usuarioActual = this.auth.currentUser!;
    // 1) ¿Es creador? (participación con orden = 1)
    const pCreador = this.relato.participaciones
      .find((p: ParticipacionRelato) => p.orden === 1);
    this.esCreador = !!pCreador && (pCreador.usuario === usuarioActual.id);

    // 2) ¿Es colaborador? (aparece en cualquier participación)
    this.esColaborador = this.relato.participaciones
      .some((p: ParticipacionRelato) => p.usuario === usuarioActual.id);
  }

  /**
   * Construye los FormGroup sólo si el usuario es creador o moderador.
   */
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
  chatExpanded = false;
  toggleChat(): void {
    this.chatExpanded = !this.chatExpanded;
  }
}
