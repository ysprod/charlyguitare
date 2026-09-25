import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TictacduoComponent } from './tictacduo.component';

describe('TictacduoComponent', () => {
  let component: TictacduoComponent;
  let fixture: ComponentFixture<TictacduoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TictacduoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TictacduoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
