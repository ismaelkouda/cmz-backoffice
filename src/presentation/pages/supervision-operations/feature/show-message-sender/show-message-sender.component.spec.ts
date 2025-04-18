/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShowMessageSenderComponent } from './show-message-sender.component';

describe('ShowMessageSenderComponent', () => {
    let component: ShowMessageSenderComponent;
    let fixture: ComponentFixture<ShowMessageSenderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShowMessageSenderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowMessageSenderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
