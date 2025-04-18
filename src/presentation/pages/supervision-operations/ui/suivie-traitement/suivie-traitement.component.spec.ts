/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SuivieTraitementComponent } from './suivie-traitement.component';

describe('SuivieTraitementComponent', () => {
    let component: SuivieTraitementComponent;
    let fixture: ComponentFixture<SuivieTraitementComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SuivieTraitementComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SuivieTraitementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
