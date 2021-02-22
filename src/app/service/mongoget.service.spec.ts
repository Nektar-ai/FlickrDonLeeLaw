import { TestBed } from '@angular/core/testing';

import { MongogetService } from './mongoget.service';

describe('MongogetService', () => {
  let service: MongogetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MongogetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
