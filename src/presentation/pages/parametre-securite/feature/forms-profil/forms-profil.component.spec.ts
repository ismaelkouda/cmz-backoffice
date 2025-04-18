/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FormsProfilComponent } from './forms-profil.component';

describe('FormsProfilComponent', () => {
    let component: FormsProfilComponent;
    let fixture: ComponentFixture<FormsProfilComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FormsProfilComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormsProfilComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
