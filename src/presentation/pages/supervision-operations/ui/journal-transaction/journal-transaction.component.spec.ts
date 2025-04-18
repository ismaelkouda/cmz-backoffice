/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { JournalTransactionComponent } from './journal-transaction.component';

describe('JournalTransactionComponent', () => {
    let component: JournalTransactionComponent;
    let fixture: ComponentFixture<JournalTransactionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [JournalTransactionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JournalTransactionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
