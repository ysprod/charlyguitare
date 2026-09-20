import { TestBed } from '@angular/core/testing';

import { TictactoeserviceService } from './tictactoeservice.service';

describe('TictactoeserviceService', () => {
  let service: TictactoeserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TictactoeserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
