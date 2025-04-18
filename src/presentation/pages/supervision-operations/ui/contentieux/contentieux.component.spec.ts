/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ContentieuxComponent } from './contentieux.component';

describe('ContencieuxComponent', () => {
    let component: ContentieuxComponent;
    let fixture: ComponentFixture<ContentieuxComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ContentieuxComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContentieuxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
