import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncemomentComponent } from './encemoment.component';

describe('EncemomentComponent', () => {
  let component: EncemomentComponent;
  let fixture: ComponentFixture<EncemomentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncemomentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncemomentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
