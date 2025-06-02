import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { paymentInterface } from '../../../data-access/payment/interface/payment.interface';
import { paymentTableConstant } from '../../../data-access/payment/constantes/payment-table';
import { PaymentApiService } from '../../../data-access/payment/service/payment-api.service';
import { paymentFilterInterface } from '../../../data-access/payment/interface/payment-filter.interface';

import {
    OperationTransaction,
    TitleOperation,
} from '../../../../../../shared/enum/OperationTransaction.enum';
import {
    PAYMENT_STATUS_ENUM,
    T_PAYMENT_STATUS_ENUM,
} from '../../../data-access/payment/enums/payment-status.enum';

type Action = PageAction;
type PageAction = {
    data: paymentInterface;
    action: 'view-payment';
    view: 'page';
};
type TYPE_COLOR_PAYMENT_STATUS_BADGE =
    | 'badge-dark'
    | 'badge-warning'
    | 'badge-primary'
    | 'badge-success'
    | 'badge-danger';
type TYPE_COLOR_ETAPE_BADGE =
    | 'badge-dark'
    | 'badge-warning'
    | 'badge-info'
    | 'badge-success';
type TYPE_COLOR_ETAT_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger';
@Component({
    selector: 'app-table-payment',
    templateUrl: './table-payment.component.html',
})
export class TablePaymentComponent {
    @Input() listPayments$: Observable<Array<paymentInterface>>;
    @Input() pagination$: Observable<Paginate<paymentInterface>>;
    @Input() spinner: boolean;
    @Output() interfaceUser = new EventEmitter<Action>();
    public paymentSelected: paymentInterface;
    public visibleFormPayment = false;

    public readonly table: TableConfig = paymentTableConstant;
    public readonly PAYMENT_STATUS_ENUM = PAYMENT_STATUS_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private paymentApiService: PaymentApiService
    ) {}

    public onExportExcel(): void {
        this.listPayments$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_payment'
                );
            }
        });
    }

    public getTitleForm(operation: OperationTransaction): string {
        const titleOp = new TitleOperation();
        titleOp.setTitleForm(operation);
        return titleOp.getTitleForm;
    }

    public pageCallback() {
        this.paymentApiService.fetchPayment({} as paymentFilterInterface);
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStepBadge(selectedPayment?: {
        etat_paiement: T_PAYMENT_STATUS_ENUM;
    }): TYPE_COLOR_PAYMENT_STATUS_BADGE {
        if (!selectedPayment || !selectedPayment.etat_paiement) {
            return 'badge-dark';
        }

        const stateMap: Record<
            T_PAYMENT_STATUS_ENUM,
            TYPE_COLOR_PAYMENT_STATUS_BADGE
        > = {
            [PAYMENT_STATUS_ENUM.UNKNOWN]: 'badge-dark',
            [PAYMENT_STATUS_ENUM.POSTED]: 'badge-warning',
            [PAYMENT_STATUS_ENUM.ABANDONED]: 'badge-warning',
            [PAYMENT_STATUS_ENUM.VALIDATED]: 'badge-success',

            [PAYMENT_STATUS_ENUM.WAITING]: 'badge-dark',
            [PAYMENT_STATUS_ENUM.REPORTED]: 'badge-primary',
            [PAYMENT_STATUS_ENUM.RESULTED]: 'badge-success',
            [PAYMENT_STATUS_ENUM.REJECTED]: 'badge-danger',
        };

        return stateMap[selectedPayment.etat_paiement];
    }

    // getStepBadge(dossier?: { etat_paiement: T_BADGE_ETAPE }): TYPE_COLOR_ETAPE_BADGE {
    //     if (!dossier || !dossier.etat_paiement) {
    //         return 'badge-dark';
    //     }

    //     const etapeMap: Record<T_BADGE_ETAPE, TYPE_COLOR_ETAPE_BADGE> = {
    //         [BADGE_ETAPE.SOUMISSION]: 'badge-dark',
    //         [BADGE_ETAPE.TRAITEMENT]: 'badge-warning',
    //         [BADGE_ETAPE.FINALISATEUR]: 'badge-info',
    //         [BADGE_ETAPE.CLOTURE]: 'badge-success',
    //     };
    //     return etapeMap[dossier.etat_paiement] || 'badge-dark';
    // }

    public handleAction(params: Action): void {
        this.onSelectPayment(params.data);

        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }

    getTreatmentButtonViewStyle(selectedPayment: {
        type_paiement: any;
        etat_facture: string;
    }): { style: string; value: string } {
        if (!!selectedPayment?.['type_paiement']) {
            return {
                style: 'badge-success',
                value: selectedPayment?.['etat_facture'],
            };
        } else {
            return {
                style: 'badge-danger',
                value: selectedPayment?.['etat_facture'],
            };
        }
    }

    private onSelectPayment(selectedPayment: paymentInterface): void {
        this.paymentSelected = selectedPayment;
        this.paymentApiService.setPaymentSelected(selectedPayment);
    }

    public hideDialog(): void {
        this.visibleFormPayment = false;
    }
}
