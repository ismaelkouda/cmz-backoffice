/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CardSecondComponent } from './card-second.component';

describe('CardSecondComponent', () => {
    let component: CardSecondComponent;
    let fixture: ComponentFixture<CardSecondComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CardSecondComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CardSecondComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
