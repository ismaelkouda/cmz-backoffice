/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GroupeFormComponent } from './groupe-form.component';

describe('GroupeFormComponent', () => {
    let component: GroupeFormComponent;
    let fixture: ComponentFixture<GroupeFormComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupeFormComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupeFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
