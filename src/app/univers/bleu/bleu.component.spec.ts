import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BleuComponent } from './bleu.component';

describe('BleuComponent', () => {
  let component: BleuComponent;
  let fixture: ComponentFixture<BleuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BleuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BleuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
