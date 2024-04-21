import { TestBed } from '@angular/core/testing';

import { NgxRekaEditorService } from './ngx-reka-editor.service';

describe('NgxRekaEditorService', () => {
  let service: NgxRekaEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRekaEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
