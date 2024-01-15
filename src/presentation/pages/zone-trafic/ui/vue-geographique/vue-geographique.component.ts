import { PusherWebsocketService } from './../../../../../shared/services/pusher-websocket.service';
import { WebsocketService } from './../../../../../shared/services/websocket.service';
import { ZoneTraficService } from './../../data-access/zone-trafic.service';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
  selector: 'app-vue-geographique',
  templateUrl: './vue-geographique.component.html',
  styleUrls: ['./vue-geographique.component.scss'],
  //providers: [RxWebsocketService]

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

  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;

  constructor(
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService,
    private settingService: SettingService,
  ) {
    //this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    //this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
  }

  ngOnInit() {
    this.GetAllZOneTrafic();
    this.GetAllDepartements();
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
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }

  public GetAllDepartements() {
    this.zoneTraficService
      .GetAllDepartements({})
      .subscribe({
        next: (response) => {
          this.listDepartements = response['data'].map(element => {
            return { ...element, fullName: `${element.libelle} [${element.code}]` }
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
      return { ...element, fullName: `${element.libelle} [${element.code}]` }
    });
  }
  onChangeSecondLevel(event: any) {
    this.selectedCommune = event.value;    
    this.listSites = this.selectedCommune?.sites.map(element => {
      return { ...element, fullName: `${element.libelle} [${element.code}]` }
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
    return true
  }
}
