import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
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
import { ASSOCIATION_ENTERPRISES_TABLE } from '../../../data-access/association-enterprises/constants/association-enterprises-table.constant';
import { AssociationEnterprisesFilterInterface } from '../../../data-access/association-enterprises/interfaces/association-enterprises-filter.interface';
import { AssociationEnterprisesInterface } from '../../../data-access/association-enterprises/interfaces/association-enterprises.interface';
import { AssociationEnterprisesApiService } from '../../../data-access/association-enterprises/services/association-enterprises-api.service';
import {
    CUSTOMERS_MANAGED_STEP_ENUM,
    T_CUSTOMERS_MANAGED_STEP_ENUM,
} from '../../../data-access/managed-customers/enums/managed-customers-step.enum';
import { CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM } from '../../../data-access/managed-customers/interfaces/managed-customers-buttons-actions.enum';

type TYPE_COLOR_STEP_BADGE = 'badge-success' | 'badge-danger';

@Component({
    selector: 'app-table-association-enterprises',
    standalone: true,
    templateUrl: './table-association-enterprises.component.html',
    styleUrls: ['./table-association-enterprises.component.scss'],
    imports: [TableModule, DialogModule, AsyncPipe, TranslateModule],
})
export class TableAssociationEnterprisesComponent {
    @Output() interfaceUser = new EventEmitter<any>();

    @Input() spinner!: boolean;
    @Input() listAssociationEnterprises$: Observable<
        AssociationEnterprisesInterface[]
    > = new BehaviorSubject<AssociationEnterprisesInterface[]>([]);
    @Input() pagination$!: Observable<
        Paginate<AssociationEnterprisesInterface>
    >;

    @Input()
    listAssociationEnterprisesStep!: T_CUSTOMERS_MANAGED_STEP_ENUM[];

    public associationEnterpriseSelected!: AssociationEnterprisesInterface;
    public table: TableConfig = ASSOCIATION_ENTERPRISES_TABLE;
    private destroy$ = new Subject<void>();

    public visibleForm = false;

    public CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM =
        CUSTOMERS_MANAGED_BUTTONS_ACTIONS_ENUM;

    constructor(
        private toastService: ToastrService,
        private loadingBarService: LoadingBarService,
        private clipboardService: ClipboardService,
        private AssociationEnterprisesApiService: AssociationEnterprisesApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {}

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    public pageCallback() {
        return this.AssociationEnterprisesApiService.fetchAssociationEnterprises(
            {} as AssociationEnterprisesFilterInterface
        );
    }

    public onExportExcel(): void {
        this.AssociationEnterprisesApiService.getAssociationEnterprises()
            .pipe(take(1))
            .subscribe((associationEnterprises) => {
                if (associationEnterprises) {
                    this.tableExportExcelFileService.exportAsExcelFile(
                        associationEnterprises,
                        this.table,
                        'list_association_enterprises'
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
        this.onSelectAssociationEnterprise(params.data);
        if (params.view === 'page') {
            this.interfaceUser.emit(params);
        }
    }

    private onSelectAssociationEnterprise(
        associationEnterpriseSelected: AssociationEnterprisesInterface
    ): void {
        this.associationEnterpriseSelected = associationEnterpriseSelected;
    }

    public handleActionButtonOpenStyle(associationEnterpriseSelected: {
        statut: string;
        traitement: string;
        code_client: string;
    }): { class: string; icon: string; tooltip: string } {
        const SIM_OF_THE_REQUEST = this.translate.instant('SIM_OF_THE_REQUEST');
        const CANNOT_SEE_THE_SIM = this.translate.instant('CANNOT_SEE_THE_SIM');
        switch (associationEnterpriseSelected?.statut) {
            case CUSTOMERS_MANAGED_STEP_ENUM.ON: {
                return {
                    class: 'p-button-dark',
                    icon: 'pi pi-folder-open',
                    tooltip: `${SIM_OF_THE_REQUEST} ${associationEnterpriseSelected.code_client}`,
                };
            }
            default: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-folder-open',
                    tooltip: `${CANNOT_SEE_THE_SIM} ${associationEnterpriseSelected.code_client}`,
                };
            }
        }
    }
}
