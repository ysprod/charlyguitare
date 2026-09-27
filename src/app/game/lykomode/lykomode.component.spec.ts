import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LykomodeComponent } from './lykomode.component';

describe('LykomodeComponent', () => {
  let component: LykomodeComponent;
  let fixture: ComponentFixture<LykomodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LykomodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LykomodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
