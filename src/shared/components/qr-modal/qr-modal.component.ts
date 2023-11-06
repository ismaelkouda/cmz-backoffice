import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
    selector: 'app-qr-modal',
    templateUrl: './qr-modal.component.html',
    styleUrls: [
        './qr-modal.component.scss'    ]
})

export class QrModalComponent implements OnInit {
    @Input() qr;
    public minioUrl: string;

    constructor(
        private activeModal: NgbActiveModal,
        private mappingService: MappingService
        ) {
            this.minioUrl = this.mappingService.minioUrl
        }

    /**
     * @author André ATCHORI
     */

    ngOnInit() {
        console.log(this.qr);
    }

    closeModal() {
        this.activeModal.close();
    }


}
