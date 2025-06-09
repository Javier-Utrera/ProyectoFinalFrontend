import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AutenticacionService } from './autenticacion.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private auth: AutenticacionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.currentUser$.pipe(
      take(1),
      map(user => {
        if (user && user.rol !== undefined && [1,3].includes(user.rol)) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
