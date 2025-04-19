import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscadorUsuariosComponent } from './buscador-usuarios.component';

describe('BuscadorUsuariosComponent', () => {
  let component: BuscadorUsuariosComponent;
  let fixture: ComponentFixture<BuscadorUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscadorUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscadorUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
