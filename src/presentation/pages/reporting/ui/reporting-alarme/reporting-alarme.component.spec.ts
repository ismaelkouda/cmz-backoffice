/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportingAlarmeComponent } from './reporting-alarme.component';

describe('ReportingAlarmeComponent', () => {
    let component: ReportingAlarmeComponent;
    let fixture: ComponentFixture<ReportingAlarmeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReportingAlarmeComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportingAlarmeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
