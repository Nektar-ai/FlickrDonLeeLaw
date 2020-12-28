import { TestBed } from '@angular/core/testing';

import { FlickrgetService } from './flickrget.service';

describe('FlickrgetService', () => {
  let service: FlickrgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlickrgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
