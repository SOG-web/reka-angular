import { TestBed } from '@angular/core/testing';
import { NgxRekaService } from './ngx-reka.service';
import { Reka } from '@rekajs/core';

describe('NgxRekaService', () => {
  let service: NgxRekaService;
  let rekaInstance: Reka;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxRekaService);
    rekaInstance = new Reka(); // Assuming Reka has a constructor with no parameters
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set Reka instance', () => {
    service.setReka(rekaInstance);
    service.reka$.subscribe(reka => {
      expect(reka).toEqual(rekaInstance);
    });
  });

  it('should provide Reka instance', () => {
    service.provideReka(rekaInstance);
    service.reka$.subscribe(reka => {
      expect(reka).toEqual(rekaInstance);
    });
  });

  // it('should emit null program when Reka instance is null', () => {
  //   service.setReka(null);
  //   service.program$.subscribe(program => {
  //     expect(program).toBeNull();
  //   });
  // });

  it('should emit program of Reka instance', () => {
    service.setReka(rekaInstance);
    service.program$.subscribe(program => {
      expect(program).toEqual(rekaInstance.program);
    });
  });
});
