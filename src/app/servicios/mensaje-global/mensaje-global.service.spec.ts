import { TestBed } from '@angular/core/testing';

import { MensajeGlobalService } from './mensaje-global.service';

describe('MensajeGlobalService', () => {
  let service: MensajeGlobalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensajeGlobalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
