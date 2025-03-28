import { EventEmitter, Input, Output } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { myAccountInterface } from '../../../data-access/my-account/interfaces/my-account.interface';
import { MyAccountApiService } from '../../../data-access/my-account/service/my-account-api.service';
import { myAccountFilterInterface } from '../../../data-access/my-account/interfaces/my-account-filter.interface';
import { myAccountTableConstant } from "../../../data-access/my-account/constants/my-account-table.constant";
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';

type Action = PageAction;
type PageAction = { data: myAccountInterface, action: 'fund-my-account', view: 'page' };

@Component({
  selector: `app-table-my-account`,
  templateUrl: `./table-my-account.component.html`
})

export class TableMyAccountComponent {

  @Input() spinner: boolean;
  @Input() listAccount$: Observable<Array<myAccountInterface>>;
  @Input() pagination$: Observable<Paginate<myAccountInterface>>;
  public table: TableConfig = myAccountTableConstant;
  @Output() interfaceUser = new EventEmitter<Action>();

  constructor(public toastService: ToastrService, private myAccountApiService: MyAccountApiService,
    private tableExportExcelFileService: TableExportExcelFileService, private translate: TranslateService,
    private clipboardService: ClipboardService) {
  }

  public copyToClipboard(data: string): void {
    const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
    this.toastService.success(translatedMessage);
    this.clipboardService.copyFromContent(data);
  }

  public pageCallback() {
    this.myAccountApiService.fetchMyAccount({} as myAccountFilterInterface);
  }

  public onExportExcel(): void {
    this.listAccount$.subscribe(data => {
      if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "list_account"); }
    });
  }

  public handleAction(params: Action): void {
    switch (params.view) {
      case 'page': this.interfaceUser.emit(params); break;
    }
  }

}