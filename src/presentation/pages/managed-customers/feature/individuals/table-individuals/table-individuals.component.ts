import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { INDIVIDUALS_TABLE } from '../../../data-access/individuals/constants/individuals-table.constant';
import { IndividualsFilterInterface } from '../../../data-access/individuals/interfaces/individuals-filter.interface';
import { IndividualsInterface } from '../../../data-access/individuals/interfaces/individuals.interface';
import { IndividualsApiService } from '../../../data-access/individuals/services/individuals-api.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-individuals',
    standalone: true,
    templateUrl: './table-individuals.component.html',
    styleUrls: ['./table-individuals.component.scss'],
    imports: [CommonModule, TableModule, AsyncPipe, DialogModule, TranslateModule],
})
export class TableIndividualsComponent {
    @Output() interfaceUser = new EventEmitter<any>();

    @Input() spinner!: boolean;
    @Input() listIndividuals$: Observable<Array<IndividualsInterface>> =
        new BehaviorSubject<Array<IndividualsInterface>>([]);
    @Input() pagination$!: Observable<Paginate<IndividualsInterface>>;

    @Input() listIndividualsStep!: Array<T_CUSTOMERS_MANAGED_STEP_ENUM>;

    public individualSelected!: IndividualsInterface;
    public table: TableConfig = INDIVIDUALS_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm: boolean = false;

    public CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM =
        CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;

    constructor(
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private IndividualsApiService: IndividualsApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.IndividualsApiService.fetchIndividuals(
            {} as IndividualsFilterInterface
        );
    }

    public onExportExcel(): void {
        this.IndividualsApiService.getIndividuals()
            .pipe(take(1))
            .subscribe((individuals) => {
                if (individuals) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        individuals,
                        this.table,
                        'list_individuals'
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
        statut: T_CUSTOMERS_MANAGED_STEP_ENUM
    ): TYPE_COLOR_STEP_BADGE {
        switch (statut) {
            case CUSTOMERS_MANAGED_STEP_ENUM.ON:
                return 'badge-success';
            case CUSTOMERS_MANAGED_STEP_ENUM.OFF:
                return 'badge-danger';
            default:
                return 'badge-danger';
        }
    }

    public handleAction(params: any): void {
        this.onSelectIndividual(params.data);
        if (params?.view === 'page') {
            this.interfaceUser.emit(params);
        }
    }

    private onSelectIndividual(individualSelected: IndividualsInterface): void {
        this.individualSelected = individualSelected;
    }

    public handleActionButtonOpenStyle(individualSelected: {
        statut: string;
        traitement: string;
        code_client: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');

        if (individualSelected?.statut === CUSTOMERS_MANAGED_STEP_ENUM.ON) {
            return {
                class: 'p-button-dark',
                icon: 'pi pi-folder-open',
                tooltip: `${SIM_OF_THE_REQUEST} ${individualSelected.code_client}`,
            };
        }

        return {
            class: 'p-button-secondary',
            icon: 'pi pi-folder-open',
            tooltip: `${CANNOT_SEE_THE_SIM} ${individualSelected.code_client}`,
        };
    }
}
