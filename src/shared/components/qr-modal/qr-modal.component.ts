import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { CurrentUser } from '../../interfaces/current-user.interface';
import { EncodingDataService } from '../../services/encoding-data.service';

@Component({
    selector: 'app-qr-modal',
    templateUrl: './qr-modal.component.html',
    styleUrls: ['./qr-modal.component.scss'],
})
export class QrModalComponent implements OnInit, OnDestroy {
    @Input() qr;
    public simQrCode: string;
    private destroy$ = new Subject<void>();

    constructor(
        private activeModal: NgbActiveModal,
        private encodingService: EncodingDataService
    ) {}

    /**
     * @author André ATCHORI
     */

    ngOnInit() {
        const user = this.encodingService.getData(
            'user_data'
        ) as CurrentUser | null;
        this.simQrCode = `${user?.tenant?.url_minio}/${this.qr?.qrcode}`;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    closeModal() {
        this.activeModal.close();
    }
}
