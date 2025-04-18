import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-carte-modal',
    templateUrl: './carte-modal.component.html',
    styleUrls: ['./carte-modal.component.scss'],
})
export class CarteModalComponent implements OnInit {
    constructor(private modalService: NgbModal) {}

    ngOnInit() {}

    hideForm() {
        this.modalService.dismissAll();
    }
}
