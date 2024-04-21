import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRekaComponent } from './ngx-reka.component';

describe('NgxRekaComponent', () => {
  let component: NgxRekaComponent;
  let fixture: ComponentFixture<NgxRekaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxRekaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxRekaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
