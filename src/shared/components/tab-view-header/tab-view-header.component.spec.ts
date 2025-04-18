/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TabViewHeaderComponent } from './tab-view-header.component';

describe('TabViewHeaderComponent', () => {
    let component: TabViewHeaderComponent;
    let fixture: ComponentFixture<TabViewHeaderComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TabViewHeaderComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TabViewHeaderComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
