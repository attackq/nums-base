import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePopupComponent } from './approve-popup.component';

describe('ApprovePopupComponent', () => {
  let component: ApprovePopupComponent;
  let fixture: ComponentFixture<ApprovePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovePopupComponent]
    });
    fixture = TestBed.createComponent(ApprovePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
