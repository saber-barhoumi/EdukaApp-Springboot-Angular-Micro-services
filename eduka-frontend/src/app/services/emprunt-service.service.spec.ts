import { TestBed } from '@angular/core/testing';

import { EmpruntServiceService } from './emprunt-service.service';

describe('EmpruntServiceService', () => {
  let service: EmpruntServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpruntServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
