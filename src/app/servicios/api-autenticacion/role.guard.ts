// src/app/core/role.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AutenticacionService } from './autenticacion.service';


@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AutenticacionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Solo admin (1) o moderador (3)
    if (this.auth.hasRole(1, 3)) {
      return true;
    }
    this.router.navigate(['/']);
    return false;
  }
}
