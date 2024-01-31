/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormSecondLevelComponent } from './form-second-level.component';

describe('FormSecondLevelComponent', () => {
  let component: FormSecondLevelComponent;
  let fixture: ComponentFixture<FormSecondLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormSecondLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSecondLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
