import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatosDisponiblesComponent } from './relatos-disponibles.component';

describe('RelatosDisponiblesComponent', () => {
  let component: RelatosDisponiblesComponent;
  let fixture: ComponentFixture<RelatosDisponiblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatosDisponiblesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatosDisponiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
