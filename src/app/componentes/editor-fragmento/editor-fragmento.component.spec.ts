import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorFragmentoComponent } from './editor-fragmento.component';

describe('EditorFragmentoComponent', () => {
  let component: EditorFragmentoComponent;
  let fixture: ComponentFixture<EditorFragmentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorFragmentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorFragmentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
