import { TestBed } from '@angular/core/testing';

import { ApiTiempoRealService } from './api-tiempo-real.service';

describe('ApiTiempoRealService', () => {
  let service: ApiTiempoRealService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTiempoRealService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
