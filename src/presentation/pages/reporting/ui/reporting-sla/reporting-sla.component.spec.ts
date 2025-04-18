/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ReportingSlaComponent } from './reporting-sla.component';

describe('ReportingSlaComponent', () => {
    let component: ReportingSlaComponent;
    let fixture: ComponentFixture<ReportingSlaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReportingSlaComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportingSlaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
