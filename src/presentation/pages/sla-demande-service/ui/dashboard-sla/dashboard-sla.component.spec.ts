/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DashboardSlaComponent } from './dashboard-sla.component';

describe('DashboardSlaComponent', () => {
    let component: DashboardSlaComponent;
    let fixture: ComponentFixture<DashboardSlaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DashboardSlaComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardSlaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
