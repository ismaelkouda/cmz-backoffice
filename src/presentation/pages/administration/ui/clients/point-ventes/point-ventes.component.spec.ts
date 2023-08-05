/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PointVentesComponent } from './point-ventes.component';

describe('PointVentesComponent', () => {
  let component: PointVentesComponent;
  let fixture: ComponentFixture<PointVentesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PointVentesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PointVentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
