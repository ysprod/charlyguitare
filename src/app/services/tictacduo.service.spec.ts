import { TestBed } from '@angular/core/testing';

import { TictacduoService } from './tictacduo.service';

describe('TictacduoService', () => {
  let service: TictacduoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TictacduoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
