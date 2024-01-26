import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ZoneTraficService } from '../../data-access/zone-trafic.service';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/shared/services/excel.service';

@Component({
  selector: 'app-sites-wrapper',
  templateUrl: './sites-wrapper.component.html',
  styleUrls: ['./sites-wrapper.component.scss']
})
export class SitesWrapperComponent implements OnInit {

  @Input() currentObject;
  @Output() formsView = new EventEmitter();
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
    private excelService: ExcelService
  ) { 
  }

  ngOnInit() {
   this.GetAllSites()
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

  public onPageChange(event) {
    this.p = event;
    this.GetAllSites()
  }
  public close(): void {
    this.formsView.emit(false);
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
