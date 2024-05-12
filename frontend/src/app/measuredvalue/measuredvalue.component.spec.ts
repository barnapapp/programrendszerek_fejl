import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeasuredvalueComponent } from './measuredvalue.component';

describe('MeasuredvalueComponent', () => {
  let component: MeasuredvalueComponent;
  let fixture: ComponentFixture<MeasuredvalueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasuredvalueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeasuredvalueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
