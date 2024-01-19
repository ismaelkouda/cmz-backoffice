/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RapportConformiteComponent } from './rapport-conformite.component';

describe('RapportConformiteComponent', () => {
  let component: RapportConformiteComponent;
  let fixture: ComponentFixture<RapportConformiteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RapportConformiteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RapportConformiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
