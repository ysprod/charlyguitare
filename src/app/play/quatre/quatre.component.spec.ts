import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuatreComponent } from './quatre.component';

describe('QuatreComponent', () => {
  let component: QuatreComponent;
  let fixture: ComponentFixture<QuatreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuatreComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuatreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
