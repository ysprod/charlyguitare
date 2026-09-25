import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LykoComponent } from './lyko.component';

describe('LykoComponent', () => {
  let component: LykoComponent;
  let fixture: ComponentFixture<LykoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LykoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LykoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
