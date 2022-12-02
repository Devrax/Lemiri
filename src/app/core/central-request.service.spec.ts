import { TestBed } from '@angular/core/testing';

import { CentralRequestService } from './central-request.service';

describe('CentralRequestService', () => {
  let service: CentralRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CentralRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
