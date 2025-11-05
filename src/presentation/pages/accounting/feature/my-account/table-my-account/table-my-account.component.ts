import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { Observable, take } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { myAccountTableConstant } from '../../../data-access/my-account/constants/my-account-table.constant';
import { myAccountFilterInterface } from '../../../data-access/my-account/interfaces/my-account-filter.interface';
import { myAccountInterface } from '../../../data-access/my-account/interfaces/my-account.interface';
import { MyAccountApiService } from '../../../data-access/my-account/service/my-account-api.service';

type PageAction = {
    data: myAccountInterface;
    action: 'fund-my-account';
    view: 'page';
};

@Component({
    selector: `app-table-my-account`,
    standalone: true,
    templateUrl: `./table-my-account.component.html`,
    imports: [TableModule, AsyncPipe],
})
export class TableMyAccountComponent {
    @Input() spinner!: boolean;
    @Input() listAccount$!: Observable<Array<myAccountInterface>>;
    @Input() pagination$!: Observable<Paginate<myAccountInterface>>;
    public table: TableConfig = myAccountTableConstant;
    @Output() interfaceUser = new EventEmitter<PageAction>();
    constructor(
        public toastService: ToastrService,
        private myAccountApiService: MyAccountApiService,
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

    public pageCallback() {
        this.myAccountApiService.fetchMyAccount({} as myAccountFilterInterface);
    }

    public onExportExcel(): void {
        this.listAccount$.pipe(take(1)).subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'list_account'
                );
            }
        });
    }

    public handleAction(params: PageAction): void {
        if (params.view === 'page') {
            this.interfaceUser.emit(params);
        }
    }
}
