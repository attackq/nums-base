import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewcardPopupComponent } from './newcard-popup.component';

describe('NewcardPopupComponent', () => {
  let component: NewcardPopupComponent;
  let fixture: ComponentFixture<NewcardPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewcardPopupComponent]
    });
    fixture = TestBed.createComponent(NewcardPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
