import { TestBed } from '@angular/core/testing';

import { SuccessAlertService } from './success-alert.service';

describe('SuccessAlertService', () => {
  let service: SuccessAlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuccessAlertService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
