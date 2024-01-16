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

  constructor(
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
    private excelService: ExcelService
  ) { }

  ngOnInit() {
   this.GetAllSites()
  }
  public GetAllSites() {
    this.zoneTraficService
      .GetAllSites({
        zone_trafic_id: this.currentObject?.id
      })
      .subscribe({
        next: (response) => {
            this.listSites = response['data']['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
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
