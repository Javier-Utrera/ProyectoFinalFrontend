// src/app/servicios/api-tiempo-real/api-tiempo-real.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Session {
  status$: Observable<'connecting' | 'connected' | 'disconnected'>;
}

@Injectable({ providedIn: 'root' })
export class ApiTiempoRealService {

}
