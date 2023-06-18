/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResiliationSimComponent } from './resiliation-sim.component';

describe('ResiliationSimComponent', () => {
  let component: ResiliationSimComponent;
  let fixture: ComponentFixture<ResiliationSimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResiliationSimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResiliationSimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
