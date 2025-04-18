/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContactSlaComponent } from './contact-sla.component';

describe('ContactSlaComponent', () => {
    let component: ContactSlaComponent;
    let fixture: ComponentFixture<ContactSlaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContactSlaComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactSlaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
