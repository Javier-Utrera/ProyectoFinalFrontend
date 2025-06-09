import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  formulario!: FormGroup;
  erroresBack: Record<string, string> = {};
  capsLockOn = false;

  constructor(
    private fb: FormBuilder,
    private authService: AutenticacionService,
    private router: Router,
    public mensajeGlobal: MensajeGlobalService
  ) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
    }, {
      validators: this.passwordsMatchValidator
    });

    // Suscribirse a valueChanges para limpiar errores de servidor
    for (const campo of Object.keys(this.formulario.controls)) {
      const ctrl = this.formulario.get(campo)!;
      ctrl.valueChanges.subscribe(() => {
        // Borrar mensaje mostrado bajo el campo
        delete this.erroresBack[campo];
        // Si tiene error 'server', se lo quitamos
        if (ctrl.hasError('server')) {
          const errs = { ...ctrl.errors! };
          delete errs['server'];
          ctrl.setErrors(Object.keys(errs).length ? errs : null);
        }
      });
    }
  }

  /** Validator cross-field */
  private passwordsMatchValidator(ctrl: AbstractControl): ValidationErrors | null {
    const p1 = ctrl.get('password1')?.value;
    const p2 = ctrl.get('password2')?.value;
    return p1 && p2 && p1 !== p2
      ? { passwordMismatch: true }
      : null;
  }

  /** Captura el estado de CapsLock en el input password1 */
  onKeyEvent(e: KeyboardEvent) {
    this.capsLockOn = e.getModifierState?.('CapsLock') ?? false;
  }

  onSubmit(): void {
    this.erroresBack = {};
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.authService.registrarUsuario(this.formulario.value)
      .subscribe({
        next: () => this.router.navigate(['/']),
        error: err => {
          if (err.status === 400 && err.error?.details) {
            const det = err.error.details as Record<string,string[]>;
            for (const campo of Object.keys(det)) {
              const msgs = det[campo];
              this.erroresBack[campo] = msgs[0];
              const ctrl = this.formulario.get(campo);
              if (ctrl) {
                // marcar error de servidor para que el campo quede inválido
                ctrl.setErrors({ server: true });
              }
            }
          }
        }
      });
  }
}
