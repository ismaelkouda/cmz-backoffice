import { IMPORTATION_LINE_STEP } from './../../data-access/interfaces/importation-line-step.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DetailsImportationTableConstant } from '../../data-access/constantes/details-importation-table';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../../../shared/services/table-export-excel-file.service';
import { DetailsImportationInterface } from '../../data-access/interfaces/details-importation.interface';
import { ImportationService } from '../../../../../data-access/importation/service/importation-api.service';
import { combineLatest, filter, Observable, take } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Paginate } from '../../../../../../../../shared/interfaces/paginate';

@Component({
    selector: `app-table-details-importation`,
    templateUrl: `./table-details-importation.component.html`,
})
export class TableDetailsImportationComponent {
    public IMPORTATION_LINE_STEP = IMPORTATION_LINE_STEP;
    @Input() listSim$: Observable<Array<DetailsImportationInterface>>;
    @Input() urlParamNumberDemand: string;
    @Input() pagination$: Observable<
        Paginate<Array<DetailsImportationInterface>>
    >;
    public IsLoading: boolean;
    public selectedDemand: Object;
    public readonly table: TableConfig = DetailsImportationTableConstant;

    constructor(
        public toastService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private importationService: ImportationService,
        private translate: TranslateService,
        private tableExportExcelFileService: TableExportExcelFileService
    ) {}

    public onExportExcel(): void {
        combineLatest([
            this.importationService.isLoadingSimDemand(),
            this.importationService.getSimDemand(),
        ])
            .pipe(
                filter(([isLoading, data]) => !isLoading && data.length > 0),
                take(1)
            )
            .subscribe(([_, data]) => {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    `list_sim_demand_${this.urlParamNumberDemand}.xlsx`
                );
            });
    }

    public pageCallback() {
        this.importationService.fetchSimDemand({
            numero_demande: this.urlParamNumberDemand,
        });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public truncateString(str: string, num: number = 20): string {
        if (str.length > num) {
            return str.slice(0, num) + '...';
        } else {
            return str;
        }
    }

    public getStepLine(data: any): string {
        switch (data?.statut) {
            case IMPORTATION_LINE_STEP.FAILURE:
                return 'badge-danger';
            case IMPORTATION_LINE_STEP.SUCCESS:
                return 'badge-success';
        }
        return 'badge-dark';
    }
}
