/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransactionMasseComponent } from './transaction-masse.component';

describe('TransactionMasseComponent', () => {
    let component: TransactionMasseComponent;
    let fixture: ComponentFixture<TransactionMasseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TransactionMasseComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TransactionMasseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
