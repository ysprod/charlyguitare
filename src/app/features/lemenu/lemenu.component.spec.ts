import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LemenuComponent } from './lemenu.component';

describe('LemenuComponent', () => {
  let component: LemenuComponent;
  let fixture: ComponentFixture<LemenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LemenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LemenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
