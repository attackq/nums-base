import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewnumberPopupComponent } from './newnumber-popup.component';

describe('NewnumberPopupComponent', () => {
  let component: NewnumberPopupComponent;
  let fixture: ComponentFixture<NewnumberPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewnumberPopupComponent]
    });
    fixture = TestBed.createComponent(NewnumberPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
