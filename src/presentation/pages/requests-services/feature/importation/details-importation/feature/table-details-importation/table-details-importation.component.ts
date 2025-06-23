import { IMPORTATION_LINE_STEP } from './../../data-access/interfaces/importation-line-step.constant';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { DetailsImportationTableConstant } from '../../data-access/constantes/details-importation-table';
import { TableConfig } from '../../../../../../../../shared/services/table-export-excel-file.service';
import { JournalComponent } from '../../../../../../../../shared/components/journal/journal.component';
import { ModalParams } from '../../../../../../../../shared/constants/modalParams.contant';
import { DetailsImportationInterface } from '../../data-access/interfaces/details-importation.interface';
const Swal = require('sweetalert2');
type ModalAction = {
    data: DetailsImportationInterface;
    action: 'journal-details-importation';
    view: 'modal';
};

@Component({
    selector: `app-table-details-importation`,
    templateUrl: `./table-details-importation.component.html`,
})
export class TableDetailsImportationComponent {
    public IMPORTATION_LINE_STEP = IMPORTATION_LINE_STEP;
    @Input() pagination;
    @Input() listSim: Array<DetailsImportationInterface>;
    public IsLoading: boolean;
    public selectedDemand: Object;
    public readonly table: TableConfig = DetailsImportationTableConstant;

    constructor(
        public toastrService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal
    ) {}

    copyData(dossier: any): void {
        this.toastrService.success('Copié dans le presse papier');
        this.clipboardService.copyFromContent(dossier);
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

    public handleAction(params: ModalAction): void {
        if (params.action === 'journal-details-importation') {
            this.showJournal(params.data);
        }
    }

    showJournal(sim: Object): void {
        const modalRef = this.ngbModal.open(JournalComponent, ModalParams);
        modalRef.componentInstance.transaction = sim['transaction'];
        modalRef.componentInstance.typeJournal = 'transactions';
    }
}
