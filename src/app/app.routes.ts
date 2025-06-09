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
import { SocialComponent } from './paginas/social/social.component';
import { SwaggerDocsComponent } from './paginas/swagger-ui-component/swagger-ui-component.component';

// ** Nuevos imports de componentes de Admin **
// import { AdminDashboardComponent } from './paginas/admin/admin-dashboard/admin-dashboard.component';
// import { AdminUsuariosComponent }   from './paginas/admin/admin-usuarios/admin-usuarios.component';
// import { AdminRelatosComponent }    from './paginas/admin/admin-relatos/admin-relatos.component';
// import { AdminParticipacionesComponent } from './paginas/admin/admin-participaciones/admin-participaciones.component';
// import { AdminComentariosComponent }     from './paginas/admin/admin-comentarios/admin-comentarios.component';
// import { AdminVotosComponent }           from './paginas/admin/admin-votos/admin-votos.component';
// import { AdminSuscripcionesComponent }   from './paginas/admin/admin-suscripciones/admin-suscripciones.component';
// import { AdminFacturasComponent }        from './paginas/admin/admin-facturas/admin-facturas.component';
// import { AdminMensajesComponent }        from './paginas/admin/admin-mensajes/admin-mensajes.component';
// import { AdminEstadisticasComponent }    from './paginas/admin/admin-estadisticas/admin-estadisticas.component';
// import { AdminPeticionesAmistadComponent } from './paginas/admin/admin-peticiones-amistad/admin-peticiones-amistad.component';

import { AuthGuard } from './servicios/api-autenticacion/auth.guard';
import { RoleGuard } from './servicios/api-autenticacion/role.guard';
import { AdminDashboardComponent } from './paginas/admin/admin-dashboard/admin-dashboard.component';

export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },

  // Rutas protegidas:
  { path: 'perfil',           component: PerfilComponent,            canActivate: [AuthGuard] },
  { path: 'perfil/:id',       component: PerfilComponent,            canActivate: [AuthGuard] },
  { path: 'social',           component: SocialComponent,            canActivate: [AuthGuard] },
  { path: 'crear-relato',     component: CrearRelatoComponent,       canActivate: [AuthGuard] },
  { path: 'mis-relatos',      component: MisRelatosComponent,        canActivate: [AuthGuard] },
  { path: 'relato/:id/editar',             component: EditarRelatoComponent, canActivate: [AuthGuard] },
  { path: 'moderador/relatos/:id/editar-final', component: EditarRelatoComponent, canActivate: [AuthGuard, RoleGuard] },

  // Rutas públicas:
  { path: 'relatos-disponibles', component: RelatosDisponiblesComponent },
  { path: 'relatos-publicados',  component: RelatosPublicadosComponent },
  { path: 'relato/:id',          component: VerRelatoComponent },
  { path: 'ranking',             component: RankingComponent },

  // Swagger
  { path: 'docs', component: SwaggerDocsComponent, canActivate: [AuthGuard, RoleGuard], data: { roles: ['ADMINISTRADOR'] } },

  // ADMINISTRACIÓN (sólo ADMINISTRADOR)
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },

  { path: '**', redirectTo: '' },
];

export const routing = provideRouter(routes);
