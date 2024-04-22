import { TestBed } from '@angular/core/testing';

import { NgxRekaParserService } from './ngx-reka-parser.service';

describe('NgxRekaParserService', () => {
  let service: NgxRekaParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRekaParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
