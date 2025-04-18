/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CourbeMessageComponent } from './courbe-message.component';

describe('CourbeMessageComponent', () => {
    let component: CourbeMessageComponent;
    let fixture: ComponentFixture<CourbeMessageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CourbeMessageComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CourbeMessageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
