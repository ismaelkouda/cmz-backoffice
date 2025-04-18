/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RecipientWrapperComponent } from './recipient-wrapper.component';

describe('RecipientWrapperComponent', () => {
    let component: RecipientWrapperComponent;
    let fixture: ComponentFixture<RecipientWrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RecipientWrapperComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RecipientWrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
