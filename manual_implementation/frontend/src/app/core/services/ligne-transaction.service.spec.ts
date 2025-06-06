import { TestBed } from '@angular/core/testing';

import { LigneTransactionService } from './ligne-transaction.service';

describe('LigneTransactionService', () => {
  let service: LigneTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LigneTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
