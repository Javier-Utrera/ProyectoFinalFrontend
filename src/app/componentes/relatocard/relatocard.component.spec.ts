import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatocardComponent } from './relatocard.component';

describe('RelatocardComponent', () => {
  let component: RelatocardComponent;
  let fixture: ComponentFixture<RelatocardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatocardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatocardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
