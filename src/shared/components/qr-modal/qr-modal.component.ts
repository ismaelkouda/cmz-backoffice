import {
    ChangeDetectionStrategy,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-qr-modal',
    templateUrl: './qr-modal.component.html',
    styleUrls: ['./qr-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrModalComponent implements OnInit, OnDestroy {
    private readonly activeModal = inject(NgbActiveModal);
    @Input() qr!: string;
    public simQrCode!: string;
    private destroy$ = new Subject<void>();

    /**
     * @author André ATCHORI
     */

    ngOnInit() {
        // const user = this.encodingService.getData(
        //     'user_data'
        // ) as CurrentUser | null;
        //this.simQrCode = `${user?.tenant?.url_minio}/${this.qr?.qrcode}`;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    closeModal() {
        this.activeModal.close();
    }
}
