import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { MappingService } from '../../../../../../shared/services/mapping.service';
import { Observable } from 'rxjs';
import { smsBalanceStatusInterface } from '../../../data-access/sms-balance-status/interfaces/sms-balance-status.interface';
import { smsBalanceStatusApiService } from '../../../data-access/sms-balance-status/services/sms-balance-status-api.service';
import { smsBalanceStatusFilterInterface } from '../../../data-access/sms-balance-status/interfaces/sms-balance-status-filter.interface';
import { smsBalanceStatusTableConstant } from "../../../data-access/sms-balance-status/constants/sms-balance-status-table.constant";
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { StoreCurrentUserService } from "../../../../../../shared/services/store-current-user.service";

@Component({
  selector: `app-table-sms-balance-status`,
  templateUrl: `./table-sms-balance-status.component.html`
})

export class TableSmsBalanceStatusComponent {

  @Input() spinner: boolean;
  @Input() listSmsBalanceStatus$: Observable<Array<smsBalanceStatusInterface>>;
  @Input() pagination$: Observable<Paginate<smsBalanceStatusInterface>>;
  public table: TableConfig = smsBalanceStatusTableConstant;

  public firstLevelLibel: string|undefined;
  public secondLevelLibel: string|undefined;
  public thirdLevelLibel: string|undefined;

  constructor(public toastService: ToastrService, private smsBalanceStatusApiService: smsBalanceStatusApiService,
    private tableExportExcelFileService: TableExportExcelFileService, private translate: TranslateService,
    private clipboardService: ClipboardService, private storeCurrentUserService: StoreCurrentUserService) {

      const currentUser = this.storeCurrentUserService.getCurrentUser;
      this.firstLevelLibel = currentUser?.structure_organisationnelle?.niveau_1;
      this.secondLevelLibel = currentUser?.structure_organisationnelle?.niveau_2;
      this.thirdLevelLibel = currentUser?.structure_organisationnelle?.niveau_3;
  }

  public copyToClipboard(data: string): void {
    const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
    this.toastService.success(translatedMessage);
    this.clipboardService.copyFromContent(data);
  }

  public pageCallback() {
    this.smsBalanceStatusApiService.fetchSmsBalanceStatus({} as smsBalanceStatusFilterInterface);
  }

  public onExportExcel(): void {
    this.listSmsBalanceStatus$.subscribe(data => {
      if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "liste_etat_des_soldes_sms"); }
    });
  }

}