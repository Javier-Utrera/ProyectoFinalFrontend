import { Component, Input } from '@angular/core';
import { EstadisticasRelatoComponent } from "../estadisticas-relato/estadisticas-relato.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Relato } from '../../servicios/api-servicios/api.models';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-relatocard',
  imports: [EstadisticasRelatoComponent,CommonModule,RouterModule],
  templateUrl: './relatocard.component.html',
  styleUrl: './relatocard.component.css'
})
export class RelatoCardComponent {
  @Input() relato!: Relato;
  @Input() origen?: 'publicado' | 'disponible' | 'mis-relatos';

  constructor(
    public auth: AutenticacionService,
    private api: ApiService,
    private router: Router
  ) {}

  /** Devuelve true si podemos eliminar este relato */
  get puedeBorrar(): boolean {
    // admin o moderador
    if (this.auth.hasRole(1, 3)) return true;
    // o si soy único autor
    if (this.origen === 'mis-relatos' && this.relato.autores.length === 1) {
      return this.relato.autores[0] === this.auth.currentUser?.id;
    }
    return false;
  }

  borrar(): void {
    if (!confirm('¿Seguro que quieres eliminar este relato?')) return;
    this.api.eliminarRelato(this.relato.id).subscribe({
      next: () => {
        alert('Relato borrado');
        // recarga o navega como necesites
        this.router.navigate(['/mis-relatos']);
      },
      error: err => alert('Error al borrar: ' + err.error?.error || err.message)
    });
  }
}
