import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRelatoComponent } from './editar-relato.component';

describe('EditarRelatoComponent', () => {
  let component: EditarRelatoComponent;
  let fixture: ComponentFixture<EditarRelatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarRelatoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarRelatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
