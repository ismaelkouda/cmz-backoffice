/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UsageMetierComponent } from './usage-metier.component';

describe('UsageMetierComponent', () => {
    let component: UsageMetierComponent;
    let fixture: ComponentFixture<UsageMetierComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UsageMetierComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UsageMetierComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
