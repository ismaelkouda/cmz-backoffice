import { Input } from "@angular/core";
import { Component } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { TableConfig, TableExportExcelFileService } from '../../../../../../shared/services/table-export-excel-file.service';
import { ClipboardService } from 'ngx-clipboard';
import { Observable } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { TranslateService } from '@ngx-translate/core';
import { downloadTableConstant } from "../../../data-access/download/constants/download-table.constant";
import { downloadInterface } from "../../../data-access/download/interfaces/download.interface";
import { downloadApiService } from "../../../data-access/download/services/download-api.service";
import { MappingService } from "../../../../../../shared/services/mapping.service";

@Component({
  selector: `app-table-download`,
  templateUrl: `./table-download.component.html`
})

export class TableDownloadComponent {

  @Input() listDownload$: Observable<Array<downloadInterface>>;
  @Input() pagination$: Observable<Paginate<downloadInterface>>;
  public table: TableConfig = downloadTableConstant;
  public downloadItemSelected: downloadInterface;

  constructor(public toastService: ToastrService, private DownloadApiService: downloadApiService,
    private tableExportExcelFileService: TableExportExcelFileService, private translate: TranslateService,
    private clipboardService: ClipboardService, private mappingService: MappingService) {}

  public copyToClipboard(data: string): void {
    const translatedMessage = this.translate.instant('COPIED_TO_THE_CLIPBOARD');
    this.toastService.success(translatedMessage);
    this.clipboardService.copyFromContent(data);
  }

  public pageCallback() {
    this.DownloadApiService.fetchDownload();
  }

  public onExportExcel(): void {
    this.listDownload$.subscribe(data => {
      if (data) { this.tableExportExcelFileService.exportAsExcelFile(data, this.table, "list_to_download"); }
    });
  }

  public handleAction(downloadItem: downloadInterface): void {
    this.onSelectDownloadItem(downloadItem);
    if (downloadItem) {
      console.log('downloadItem.url_fichier', downloadItem.url_fichier)
      const baseUrl = this.mappingService.baseUrl.replace("/api/v1", "");
      window.open(baseUrl + downloadItem.url_fichier), '_blank';
    }
  }

  private onSelectDownloadItem(selectedDownloadItem: downloadInterface): void {
    this.downloadItemSelected = selectedDownloadItem;
  }
}