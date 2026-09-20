import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlancComponent } from './blanc.component';

describe('BlancComponent', () => {
  let component: BlancComponent;
  let fixture: ComponentFixture<BlancComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlancComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlancComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
