import { Component, Input } from '@angular/core';
import { EstadisticasRelatoComponent } from "../estadisticas-relato/estadisticas-relato.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Relato } from '../../servicios/api-servicios/api.models';
import { AutenticacionService } from '../../servicios/api-autenticacion/autenticacion.service';
import { ApiService } from '../../servicios/api-servicios/api.service';
import { Router } from '@angular/router';
import { MensajeGlobalService } from '../../servicios/mensaje-global/mensaje-global.service';

@Component({
  selector: 'app-relatocard',
  imports: [EstadisticasRelatoComponent, CommonModule, RouterModule],
  templateUrl: './relatocard.component.html',
  styleUrl: './relatocard.component.css'
})
export class RelatoCardComponent {
  @Input() relato!: Relato;
  @Input() origen?: 'publicado' | 'disponible' | 'mis-relatos';

  private generoToImageUrl: { [key: string]: string } = {
    fantasia: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060373/fantasia_proby6.png',
    ciencia_ficcion: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060373/ciencia_p0rbnk.png',
    terror: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060372/terror_sj42uf.png',
    romance: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060372/romance_ihpld6.png',
    misterio: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060372/misterio_zc3dgl.png',
    thriller: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060372/thriller_mdvgbl.png',
    historico: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060373/historico_fsvbvz.png',
    aventura: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060373/aventura_kpzpqq.png',
    poesia: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060372/poesia_ziq9pq.png',
    humor: 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749060372/humor_nh03ee.png',
  };

  constructor(
    public auth: AutenticacionService,
    private api: ApiService,
    private router: Router,
    private msj: MensajeGlobalService
  ) { }

  get imagenFondo(): string {
    // 1) Si no hay géneros, uso la imagen genérica
    if (!this.relato.generos) {
      return 'https://res.cloudinary.com/dgvzeegli/image/upload/v1749061150/generico_atnupq.png';
    }
    
    let primerGenero: string;
    if (Array.isArray(this.relato.generos)) {
      primerGenero = this.relato.generos.length > 0
        ? (this.relato.generos[0] as string)
        : '';
    } else {
      primerGenero = this.relato.generos as string;
    }
  
    // 3) Devuelvo la URL del mapa o la genérica si no existe
    return this.generoToImageUrl[primerGenero] ||
           'https://res.cloudinary.com/dgvzeegli/image/upload/v1749061150/generico_atnupq.png';
  }
  

  /** Devuelve true si podemos eliminar este relato */
  get puedeBorrar(): boolean {
    if (this.auth.hasRole(1, 3)) return true;
    if (this.origen === 'mis-relatos' && this.relato.autores.length === 1) {
      return this.relato.autores[0] === this.auth.currentUser?.id;
    }
    return false;
  }

  async borrar(): Promise<void> {
    const ok = await this.msj.confirmar('¿Seguro que quieres eliminar este relato?');
    if (!ok) return;

    this.api.eliminarRelato(this.relato.id).subscribe({
      next: () => {
        this.router.navigate(['/mis-relatos']);
      },
      error: () => {
      }
    });
  }
}
