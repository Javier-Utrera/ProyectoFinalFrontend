import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesEnviadasComponent } from './solicitudes-enviadas.component';

describe('SolicitudesEnviadasComponent', () => {
  let component: SolicitudesEnviadasComponent;
  let fixture: ComponentFixture<SolicitudesEnviadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesEnviadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesEnviadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
