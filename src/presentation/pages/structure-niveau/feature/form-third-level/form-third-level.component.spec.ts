/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormThirdLevelComponent } from './form-third-level.component';

describe('FormThirdLevelComponent', () => {
    let component: FormThirdLevelComponent;
    let fixture: ComponentFixture<FormThirdLevelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormThirdLevelComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormThirdLevelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
