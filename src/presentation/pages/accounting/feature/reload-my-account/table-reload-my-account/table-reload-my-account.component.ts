import {
    MY_RELOADS_STATUS_ENUM,
    T_MY_RELOADS_STATUS_ENUM,
} from '../../../data-access/reload-my-account/enums/reload-my-account-status.enum';
import { EventEmitter, Input, Output } from '@angular/core';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { Observable, take } from 'rxjs';
import { reloadMyAccountInterface } from '../../../data-access/reload-my-account/interfaces/reload-my-account.interface';
import { ReloadMyAccountApiService } from '../../../data-access/reload-my-account/service/reload-my-account-api.service';
import { reloadMyAccountFilterInterface } from '../../../data-access/reload-my-account/interfaces/reload-my-account-filter.interface';
import { reloadMyAccountTableConstant } from '../../../data-access/reload-my-account/constants/reload-my-account-table.constant';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { createButtonStyle } from '../../../../../../shared/functions/treatment-demands.function';

type Action = PageAction;
type PageAction = {
    data: reloadMyAccountInterface | null;
    action:
        | 'reload-my-account'
        | 'edit-reload-my-account'
        | 'details-reload-my-account';
    view: 'page';
};
type TYPE_COLOR_STATUS_BADGE =
    | 'badge-warning'
    | 'badge-success'
    | 'badge-danger'
    | 'badge-dark';

@Component({
    selector: `app-table-reload-my-account`,
    templateUrl: `./table-reload-my-account.component.html`,
})
export class TableReloadMyAccountComponent {
    @Input() spinner: boolean;
    @Input() listReloadAccount$: Observable<Array<reloadMyAccountInterface>>;
    @Input() pagination$: Observable<Paginate<reloadMyAccountInterface>>;
    public table: TableConfig = reloadMyAccountTableConstant;
    @Output() interfaceUser = new EventEmitter<Action>();

    constructor(
        public toastService: ToastrService,
        private reloadMyAccountApiService: ReloadMyAccountApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private clipboardService: ClipboardService
    ) {}

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    public getStatusReloadAccount(selectedSimCard?: {
        statut: T_MY_RELOADS_STATUS_ENUM;
    }): TYPE_COLOR_STATUS_BADGE {
        if (!selectedSimCard || !selectedSimCard.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<
            T_MY_RELOADS_STATUS_ENUM,
            TYPE_COLOR_STATUS_BADGE
        > = {
            [MY_RELOADS_STATUS_ENUM.WAITING]: 'badge-dark',
            [MY_RELOADS_STATUS_ENUM.VALIDATED]: 'badge-success',
            [MY_RELOADS_STATUS_ENUM.IN_PROGRESS]: 'badge-warning',
            [MY_RELOADS_STATUS_ENUM.REJECTED]: 'badge-danger',
        };
        return etapeMap[selectedSimCard.statut] || 'badge-dark';
    }

    public pageCallback() {
        this.reloadMyAccountApiService.fetchReloadMyAccount(
            {} as reloadMyAccountFilterInterface
        );
    }

    public onExportExcel(): void {
        this.listReloadAccount$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'list_reload_account'
                );
            }
        });
    }
    getTreatmentButtonEditStyle(selectedSimCard: {
        statut: T_MY_RELOADS_STATUS_ENUM;
        transaction: string;
    }): { class: string; icon: string; tooltip: string } {
        switch (selectedSimCard?.statut) {
            case MY_RELOADS_STATUS_ENUM.WAITING: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-pencil',
                    tooltip: `Editer ${selectedSimCard.transaction}`,
                };
            }
            default: {
                return {
                    class: 'p-button-secondary',
                    icon: 'pi pi-pencil',
                    tooltip: `Impossible d'éditer ${selectedSimCard.transaction}`,
                };
            }
        }
    }

    public handleAction(params: Action): void {
        switch (params.view) {
            case 'page':
                this.interfaceUser.emit(params);
                break;
        }
    }
}
