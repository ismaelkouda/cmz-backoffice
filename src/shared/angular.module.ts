import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgbModule],
    exports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgbModule],
    providers: []
})

export class AngularModule {

}