import { ZoneTraficService } from './../../data-access/zone-trafic.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-vue-geographique',
  templateUrl: './vue-geographique.component.html',
  styleUrls: ['./vue-geographique.component.scss']
})
export class VueGeographiqueComponent implements OnInit {

  public datas: any;
  public currentZone: any;
  public display: boolean = false;
  public isMaximized: boolean = false;
  public maxi: boolean;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public listZonesTrafics: any;
  public listDepartements: Array<any> = [];
  public listCommunes: Array<any> = [];
  public selectedDepartement: any;
  public selectedCommune: any;
  public selectedZone: any;

  constructor(
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
    private settingService: SettingService,
    private clipboardApi: ClipboardService,
    private httpClient: HttpClient,


  ) { }

  ngOnInit() {
    this.GetAllZOneTrafic();
    this.GetAllDepartements();
    this.GetAllCommunes()
    this.isFilter();
  }

  public GetAllZOneTrafic() {
    this.zoneTraficService
      .GetAllZOneTrafic({}, this.p)
      .subscribe({
        next: (response) => {
          this.listZonesTrafics = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GetAllZOneTrafic()
    } else {
      this.onFilter()
    }
  }
  public GetAllDepartements() {
    this.zoneTraficService
      .GetAllDepartements()
      .subscribe({
        next: (response) => {
          this.listDepartements = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public GetAllCommunes() {
    this.zoneTraficService
      .GetAllCommunes()
      .subscribe({
        next: (response) => {
          this.listCommunes = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  showMap(data) {
    if (data.poste_distributions_count === 0) {
      return
    } else {
      this.currentZone = data;
      this.GetPositionSimGeojson(data.id);
      this.maxi = false;
    }
  }

  hideDialog() {
    this.display = false;
  }

  onChangeItem(event: any) {
    this.selectedDepartement = event.value;
  }
  onMaximized(e) {
    this.maxi = e.maximized;
  }
  copyData(data: any): void {
    this.clipboardApi.copyFromContent(data);
    this.toastrService.success('Copié dans le presse papier');
  }
  public isFilter(): boolean {
    return (!this.selectedDepartement && !this.selectedCommune && !this.selectedZone) ? true : false
  }
  public onFilter() {
    this.zoneTraficService
      .GetAllZOneTrafic({
        departement_id: this.selectedDepartement?.id,
        commune_id: this.selectedCommune,
        zone_trafic: this.selectedZone,
      }, this.p).subscribe({
        next: (response) => {
          this.listZonesTrafics = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  GetPositionSimGeojson(id: number) {

    this.httpClient.get("assets/site.geojson")
      .subscribe({
        next: (res: any) => {
          this.datas = res;
          this.display = true;
          this.onDialogMaximized(true);
          //this.datas = res.data;
        }, error: (error) => {
        }
      })

    // this.zoneTraficService
    //   .GetPositionSimGeojson({
    //     niveau_deux_id: id
    //   }).subscribe({
    //     next: (response) => {
    //       this.datas = response.data;
    //       this.display = true;
    //     },
    //     error: (error) => {
    //       this.toastrService.error(error.message);
    //     }
    //   })
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public disableAction(): boolean {
    return true
  }
}
