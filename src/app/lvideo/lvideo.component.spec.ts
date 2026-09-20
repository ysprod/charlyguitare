import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LvideoComponent } from './lvideo.component';

describe('LvideoComponent', () => {
  let component: LvideoComponent;
  let fixture: ComponentFixture<LvideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LvideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LvideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
