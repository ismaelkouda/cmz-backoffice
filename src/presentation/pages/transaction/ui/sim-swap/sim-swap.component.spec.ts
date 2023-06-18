/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SimSwapComponent } from './sim-swap.component';

describe('SimSwapComponent', () => {
  let component: SimSwapComponent;
  let fixture: ComponentFixture<SimSwapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimSwapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimSwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
