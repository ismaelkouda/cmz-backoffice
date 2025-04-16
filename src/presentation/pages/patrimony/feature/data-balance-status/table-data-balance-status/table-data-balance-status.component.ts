import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { dataBalanceStatusInterface } from '../../../data-access/data-balance-status/interfaces/data-balance-status.interface';
import { dataBalanceStatusApiService } from '../../../data-access/data-balance-status/services/data-balance-status-api.service';
import { dataBalanceStatusFilterInterface } from '../../../data-access/data-balance-status/interfaces/data-balance-status-filter.interface';
import { dataBalanceStatusTableConstant } from "../../../data-access/data-balance-status/constants/data-balance-status-table.constant";
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { StoreCurrentUserService } from "../../../../../../shared/services/store-current-user.service";

@Component({
  selector: `app-table-data-balance-status`,
  templateUrl: `./table-data-balance-status.component.html`
})

export class TableDataBalanceStatusComponent {

  @Input() spinner: boolean;
  @Input() listDataBalanceStatus$: Observable<Array<dataBalanceStatusInterface>>;
  @Input() pagination$: Observable<Paginate<dataBalanceStatusInterface>>;
  public table: TableConfig = dataBalanceStatusTableConstant;

  public firstLevelLibel: string|undefined;
  public secondLevelLibel: string|undefined;
  public thirdLevelLibel: string|undefined;

  constructor(public toastService: ToastrService, private dataBalanceStatusApiService: dataBalanceStatusApiService,
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
    this.dataBalanceStatusApiService.fetchDataBalanceStatus({} as dataBalanceStatusFilterInterface);
  }

  public onExportExcel(): void {
    this.listDataBalanceStatus$.subscribe(data => {
      if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "liste_etat_des_soldes_data"); }
    });
  }

}