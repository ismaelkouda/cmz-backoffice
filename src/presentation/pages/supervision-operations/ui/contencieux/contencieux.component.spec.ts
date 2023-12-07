/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContencieuxComponent } from './contencieux.component';

describe('ContencieuxComponent', () => {
  let component: ContencieuxComponent;
  let fixture: ComponentFixture<ContencieuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContencieuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContencieuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
