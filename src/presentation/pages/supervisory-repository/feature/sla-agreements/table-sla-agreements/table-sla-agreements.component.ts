import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { SLA_AGREEMENTS_TABLE } from '../../../data-access/sla-agreements/constants/sla-agreements-table.constant';
import {
    SLA_AGREEMENTS_STATUS_ENUM,
    T_SLA_AGREEMENTS_STATUS_ENUM,
} from '../../../data-access/sla-agreements/enums/sla-agreements-status.enum';
import { SlaAgreementsInterface } from '../../../data-access/sla-agreements/interfaces/sla-agreements.interface';
import { SlaAgreementsApiService } from '../../../data-access/sla-agreements/services/sla-agreements-api.service';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-sla-agreements',
    standalone: true,
    templateUrl: './table-sla-agreements.component.html',
    styleUrls: ['./table-sla-agreements.component.scss'],
    imports: [CommonModule, TableModule, AsyncPipe],
})
export class TableSlaAgreementsComponent implements OnDestroy {
    public nbDataPerPage = 50;
    @Input() spinner!: boolean;
    @Input() listSlaAgreements$: Observable<Array<SlaAgreementsInterface>> =
        new BehaviorSubject<Array<SlaAgreementsInterface>>([]);

    public slaAgreementSelected!: SlaAgreementsInterface;
    public table: TableConfig = SLA_AGREEMENTS_TABLE;
    private destroy$ = new Subject<void>();

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private slaAgreementsApiService: SlaAgreementsApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.slaAgreementsApiService.fetchSlaAgreements();
    }

    public onExportExcel(): void {
        this.slaAgreementsApiService
            .getSlaAgreements()
            .pipe(take(1))
            .subscribe((slaAgreements) => {
                if (slaAgreements) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        slaAgreements,
                        this.table,
                        'list_sla_agreements'
                    );
                } else {
                    this.toastService.error(
                        this.translate.instant('NO_DATA_TO_EXPORT')
                    );
                }
            });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStepBadge(
        statut: T_SLA_AGREEMENTS_STATUS_ENUM
    ): TYPE_COLOR_STEP_BADGE {
        switch (statut) {
            case SLA_AGREEMENTS_STATUS_ENUM.ACTIVE:
                return 'badge-success';
            case SLA_AGREEMENTS_STATUS_ENUM.INACTIVE:
                return 'badge-danger';
            default:
                return 'badge-danger';
        }
    }
}
