import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticasRelatoComponent } from './estadisticas-relato.component';

describe('EstadisticasRelatoComponent', () => {
  let component: EstadisticasRelatoComponent;
  let fixture: ComponentFixture<EstadisticasRelatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticasRelatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticasRelatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
