/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CreditFormComponent } from './credit-form.component';

describe('CreditFormComponent', () => {
    let component: CreditFormComponent;
    let fixture: ComponentFixture<CreditFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CreditFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CreditFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
