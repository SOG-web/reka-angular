import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRekaParserComponent } from './ngx-reka-parser.component';

describe('NgxRekaParserComponent', () => {
  let component: NgxRekaParserComponent;
  let fixture: ComponentFixture<NgxRekaParserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxRekaParserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxRekaParserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
