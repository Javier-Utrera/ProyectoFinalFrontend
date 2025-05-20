import { Routes } from '@angular/router';
import { provideRouter } from '@angular/router';

import { InicioComponent } from './paginas/inicio/inicio.component';
import { LoginComponent } from './paginas/login/login.component';
import { RegistroComponent } from './paginas/registro/registro.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { CrearRelatoComponent } from './paginas/relatos/crear-relato/crear-relato.component';
import { MisRelatosComponent } from './paginas/relatos/mis-relatos/mis-relatos.component';
import { RelatosPublicadosComponent } from './paginas/relatos/relatos-publicados/relatos-publicados.component';
import { VerRelatoComponent } from './paginas/relatos/ver-relato/ver-relato.component';
import { EditarRelatoComponent } from './paginas/relatos/editar-relato/editar-relato.component';
import { RelatosDisponiblesComponent } from './paginas/relatos/relatos-disponibles/relatos-disponibles.component';
import { RankingComponent } from './paginas/ranking/ranking.component';
import { AuthGuard } from './servicios/api-autenticacion/auth.guard';
import { SocialComponent } from './paginas/social/social.component';
import { RoleGuard } from './servicios/api-autenticacion/role.guard';
import { SwaggerDocsComponent } from './paginas/swagger-ui-component/swagger-ui-component.component';

export const routes: Routes = [

  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas protegidas:
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'perfil/:id', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'social', component: SocialComponent, canActivate: [AuthGuard] },
  { path: 'crear-relato', component: CrearRelatoComponent, canActivate: [AuthGuard] },
  { path: 'mis-relatos', component: MisRelatosComponent, canActivate: [AuthGuard] },
  { path: 'relato/:id/editar', component: EditarRelatoComponent, canActivate: [AuthGuard] },
  { path: 'moderador/relatos/:id/editar-final', component: EditarRelatoComponent, canActivate: [AuthGuard, RoleGuard] },


  // Rutas públicas:
  { path: 'relatos-disponibles', component: RelatosDisponiblesComponent },
  { path: 'relatos-publicados', component: RelatosPublicadosComponent },
  { path: 'relato/:id', component: VerRelatoComponent },
  { path: 'ranking', component: RankingComponent },

  // Admin
  { path: 'docs', component: SwaggerDocsComponent,canActivate: [AuthGuard, RoleGuard] },

  { path: '**', redirectTo: '' },
  
];

export const routing = provideRouter(routes);
