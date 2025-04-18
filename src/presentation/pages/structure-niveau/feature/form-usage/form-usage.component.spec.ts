/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormUsageComponent } from './form-usage.component';

describe('FormUsageComponent', () => {
    let component: FormUsageComponent;
    let fixture: ComponentFixture<FormUsageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormUsageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormUsageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
