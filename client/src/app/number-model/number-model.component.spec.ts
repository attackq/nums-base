import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberModelComponent } from './number-model.component';

describe('NumberModelComponent', () => {
  let component: NumberModelComponent;
  let fixture: ComponentFixture<NumberModelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NumberModelComponent]
    });
    fixture = TestBed.createComponent(NumberModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
