import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRekaEditorComponent } from './ngx-reka-editor.component';

describe('NgxRekaEditorComponent', () => {
  let component: NgxRekaEditorComponent;
  let fixture: ComponentFixture<NgxRekaEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxRekaEditorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NgxRekaEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
