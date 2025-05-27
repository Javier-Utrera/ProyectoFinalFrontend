import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibroCargaComponent } from './libro-carga.component';

describe('LibroCargaComponent', () => {
  let component: LibroCargaComponent;
  let fixture: ComponentFixture<LibroCargaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibroCargaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibroCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
