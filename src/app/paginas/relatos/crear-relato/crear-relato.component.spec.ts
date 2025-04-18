import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearRelatoComponent } from './crear-relato.component';

describe('CrearRelatoComponent', () => {
  let component: CrearRelatoComponent;
  let fixture: ComponentFixture<CrearRelatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearRelatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearRelatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
