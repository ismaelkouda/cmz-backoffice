/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JournalAuthenticationComponent } from './journal-authentication.component';

describe('JournalAuthenticationComponent', () => {
    let component: JournalAuthenticationComponent;
    let fixture: ComponentFixture<JournalAuthenticationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JournalAuthenticationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JournalAuthenticationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
