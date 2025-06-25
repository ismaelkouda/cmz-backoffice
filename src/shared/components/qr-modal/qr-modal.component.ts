import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { StoreCurrentUserService } from '../../services/store-current-user.service';

@Component({
    selector: 'app-qr-modal',
    templateUrl: './qr-modal.component.html',
    styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit {
    @Input() qr;
    public simQrCode: string;

    constructor(
        private activeModal: NgbActiveModal,
        private storeCurrentUserService: StoreCurrentUserService
    ) {}

    /**
     * @author André ATCHORI
     */

    ngOnInit() {
        const currentUser: CurrentUser | null =
            this.storeCurrentUserService.getCurrentUser;
        this.simQrCode = `${currentUser?.tenant?.url_minio}/${this.qr?.qrcode}`;
    }

    closeModal() {
        this.activeModal.close();
    }
}
