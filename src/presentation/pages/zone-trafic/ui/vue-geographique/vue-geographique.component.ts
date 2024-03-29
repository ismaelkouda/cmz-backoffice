import { ZoneTraficService } from './../../data-access/zone-trafic.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/shared/services/excel.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-vue-geographique',
  templateUrl: './vue-geographique.component.html',
  styleUrls: ['./vue-geographique.component.scss'],
})
export class VueGeographiqueComponent implements OnInit {

  public datas: any;
  public zoneId:number;
  public currentZone: any;
  public displayValue: boolean = false;
  public isMaximized: boolean = false;
  public maxi: boolean;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number;
  public listZonesTrafics: any;
  public listDepartements: Array<any> = [];
  public listCommunes: Array<any> = [];
  public listSites: Array<any> = [];
  public selectedDepartement: any;
  public selectedCommune: any;
  public selectedSite: any;
  public selectedSim: any
  public selectedZone: string;
  public currentObject: any;
  public initialView: boolean = true;
  public formsView: boolean = false;

  listMesssages = [];

  constructor(
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private excelService: ExcelService,
  ) {
  }

  ngOnInit() {
    if (this.initialView) {
      this.GetAllZOneTrafic();
    }
    this.GetAllDepartements();
    this.disableAction()
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
          this.page = response.data?.current_page;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
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

  public onInitForm(data): void {
    this.totalPage = 0;
    this.totalRecords = 0;
    this.recordsPerPage = 0;
    this.page = 1;
    setTimeout(() => {
      this.initialView = false;
      this.formsView = true;
      this.currentObject = data;
    }, 500);
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
    this.GetAllZOneTrafic()
  }

  public GetAllDepartements() {
    this.zoneTraficService
      .GetAllDepartements({})
      .subscribe({
        next: (response) => {
          this.listDepartements = response['data'].map(element => {
            return { ...element, fullName: `${element.libelle}` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  onChangeFirstLvel(event: any) {
    this.selectedDepartement = event.value;
    this.listCommunes = this.selectedDepartement?.communes.map(element => {
      return { ...element, fullName: `${element.libelle}` }
    });
  }
  onMaximized(e) {
    this.maxi = e.maximized;
  }
  copyData(data: any): void {
    this.clipboardApi.copyFromContent(data);
    this.toastrService.success('Copié dans le presse papier');
  }
  public onFilter() {
    this.zoneTraficService
      .GetAllZOneTrafic({
        departement_id: this.selectedDepartement?.id,
        commune_id: this.selectedCommune?.id,
        zone_trafic: this.selectedZone,
        msisdn: this.selectedSim,
        site: this.selectedSite
      }, this.p).subscribe({
        next: (response) => {
          this.listZonesTrafics = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
          this.page = response.data?.current_page;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public OnRefresh(){
    this.p = 1;
    this.selectedDepartement = null
    this.selectedCommune = null
    this.selectedZone = null
    this.selectedSite = null
    this.listCommunes = []
    this.GetAllZOneTrafic()
  }
  GetPositionSimGeojson(id: number) {
    this.zoneTraficService
      .GetPositionSimGeojson(id).subscribe({
        next: (response) => {
          this.zoneId = id;
          this.datas = response['data'];
         this.onDialogMaximized(true);
         this.displayValue = true;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
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

  handleClose() {
    this.displayValue = false;    
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public isFilter(): boolean {
    return (!this.selectedDepartement && !this.selectedCommune && !this.selectedZone && !this.selectedSite && !this.selectedSim) ? true : false
  }
  public disableAction(): boolean {
    return (this.listZonesTrafics === undefined || this.listZonesTrafics?.length === 0) ? true : false
  }
  public OnExportExcel(): void {
    const data = this.listZonesTrafics.map((item: any) => ({
      'Département': item?.departement_nom,
      'Commune': item?.commune_nom,
      'Zone Trafic': item?.libelle,
      '# Sites': item?.sites_count,
      '# SIMs': item?.sims_count,
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des zones de trafics');
  }
}
