/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ShowNotificationComponent } from './show-notification.component';

describe('ShowNotificationComponent', () => {
    let component: ShowNotificationComponent;
    let fixture: ComponentFixture<ShowNotificationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ShowNotificationComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ShowNotificationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
