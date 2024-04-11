/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DataPollingComponent } from './data-polling.component';

describe('DataPollingComponent', () => {
  let component: DataPollingComponent;
  let fixture: ComponentFixture<DataPollingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataPollingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataPollingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
