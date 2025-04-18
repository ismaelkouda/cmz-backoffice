/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RapportTransactionComponent } from './rapport-transaction.component';

describe('RapportTransactionComponent', () => {
    let component: RapportTransactionComponent;
    let fixture: ComponentFixture<RapportTransactionComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RapportTransactionComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RapportTransactionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
