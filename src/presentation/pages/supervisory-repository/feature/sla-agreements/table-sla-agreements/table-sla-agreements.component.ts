import {
    SLA_AGREEMENTS_STATUS_ENUM,
    T_SLA_AGREEMENTS_STATUS_ENUM,
} from './../../../data-access/sla-agreements/enums/sla-agreements-status.enum';
import { Component, Input } from '@angular/core';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { slaAgreementsInterface } from '../../../data-access/sla-agreements/interfaces/sla-agreements.interface';
import { slaAgreementsTableConstant } from '../../../data-access/sla-agreements/constants/sla-agreements-table.constant';
import { Observable, take } from 'rxjs';
import { SlaAgreementsApiService } from '../../../data-access/sla-agreements/services/sla-agreements-api.service';

type TYPE_COLOR_STATUS_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-sla-agreements',
    templateUrl: './table-sla-agreements.component.html',
})
export class TableSlaAgreementsComponent {
    @Input() listSlaAgreements$: Observable<Array<slaAgreementsInterface>>;
    slaAgreementsSelected: slaAgreementsInterface;

    public readonly table: TableConfig = slaAgreementsTableConstant;

    constructor(
        private tableExportExcelFileService: TableExportExcelFileService,
        private slaAgreementsApiService: SlaAgreementsApiService
    ) {}

    public onExportExcel(): void {
        this.listSlaAgreements$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'List_sla_agreements'
                );
            }
        });
    }

    public pageCallback() {
        this.slaAgreementsApiService.fetchSlaAgreements();
    }

    public getStatusSlaAgreementsBadge(selectedSlaAgreements?: {
        statut: T_SLA_AGREEMENTS_STATUS_ENUM;
    }): TYPE_COLOR_STATUS_BADGE {
        if (!selectedSlaAgreements || !selectedSlaAgreements.statut) {
            return 'badge-success';
        }

        const etapeMap: Record<
            T_SLA_AGREEMENTS_STATUS_ENUM,
            TYPE_COLOR_STATUS_BADGE
        > = {
            [SLA_AGREEMENTS_STATUS_ENUM.ACTIVE]: 'badge-success',
            [SLA_AGREEMENTS_STATUS_ENUM.INACTIVE]: 'badge-danger',
        };
        return etapeMap[selectedSlaAgreements.statut] || 'badge-success';
    }
}
