/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VueGeographiqueComponent } from './vue-geographique.component';

describe('VueGeographiqueComponent', () => {
  let component: VueGeographiqueComponent;
  let fixture: ComponentFixture<VueGeographiqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueGeographiqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueGeographiqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
