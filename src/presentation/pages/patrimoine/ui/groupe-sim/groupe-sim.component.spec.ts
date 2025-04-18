/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GroupeSimComponent } from './groupe-sim.component';

describe('GroupeSimComponent', () => {
    let component: GroupeSimComponent;
    let fixture: ComponentFixture<GroupeSimComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GroupeSimComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GroupeSimComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
