import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneTraficService } from '../../data-access/zone-trafic.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/shared/services/excel.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-sites-wrapper',
  templateUrl: './sites-wrapper.component.html',
  styleUrls: ['./sites-wrapper.component.scss']
})
export class SitesWrapperComponent implements OnInit {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
  public selectedSite: any;
  public listSites: Array<any> = [];
  public totalPages: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public pages: number = 1

  constructor(
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
    private excelService: ExcelService,
    private clipboardApi: ClipboardService,
  ) { }

  ngOnInit() {
   this.GetAllSites()
   this.isFilter()
  }
  public GetAllSites() {
    this.zoneTraficService
      .GetAllSites({
        zone_trafic_id: this.currentObject?.id
      },this.p)
      .subscribe({
        next: (response) => {
            this.listSites = response.data.data
            this.totalPages = response.data.last_page;
            this.totalRecords = response.data.total;
            this.recordsPerPage = response.data.per_page;
            this.pages = response.data?.current_page;
            this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnFilter() {
    this.zoneTraficService
      .GetAllSites({
        zone_trafic_id: this.currentObject?.id,
        libelle: this.selectedSite
      },this.p)
      .subscribe({
        next: (response) => {
            this.listSites = response.data.data
            this.totalPages = response.data.last_page;
            this.totalRecords = response.data.total;
            this.recordsPerPage = response.data.per_page;
            this.pages = response.data?.current_page;
            this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnRefresh(){
    this.p = 1;
    this.GetAllSites();
    this.selectedSite = null;
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllSites()
  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public close(): void {
    this.formsView.emit(false);
  }
  public isFilter(): boolean {
    return (!this.selectedSite) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listSites.map((item: any) => ({
      'Nom': item?.libelle,
      'Latitude': item?.latitude,
      'Longitude': item?.longitude,
    }));
    this.excelService.exportAsExcelFile(data, `Lise des Sites`);
  }
}
