import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { ClipboardService } from 'ngx-clipboard';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-lifecycle-sim',
  templateUrl: './lifecycle-sim.component.html',
  styleUrls: ['./lifecycle-sim.component.scss']
})
export class LifecycleSimComponent implements OnInit {

  public listCycles: any;
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public display: boolean = false;
  public isMaximized: boolean = false;
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: string;
  public selectedimsi: string;
  public currentEvent: any;
  public selectDateStart: any;
  public selectDateEnd: any;
  public filterDateStart: Date;
  public filterDateEnd: Date;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;

  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;

  constructor(
    public toastrService: ToastrService,
    public settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    private mappingService: MappingService

  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    //this.filterDateStart = new Date();
    //this.filterDateEnd = new Date();
    //this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
    //this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  ngOnInit() {
    this.GetAllCycles();
    this.getAllDirectionRegionales();
    this.isFilter()
  }

  public GetAllCycles() {
    this.patrimoineService
      .GetAllCycles({}, this.p)
      .subscribe({
        next: (response) => {
          this.listCycles = response.data.data;
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
      this.GetAllCycles()
    } else {
      this.onFilter()
    }
  }
  public onFilter() {
    if (this.selectDateEnd && this.selectDateStart) {
      if (moment(this.selectDateStart).isAfter(moment(this.selectDateEnd))) {
        this.toastrService.error('Plage de date invalide');
        return;
      }
    }
    this.patrimoineService
      .GetAllCycles({
        niveau_un_id: this.selectedDirection?.id,
        niveau_deux_id: this.selectedExploitation?.id,
        imsi: this.selectedimsi,
        date_debut: this.selectDateStart,
        date_fin: this.selectDateEnd,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listCycles = response.data.data;
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
  public getAllDirectionRegionales() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirections = response['data'].map(element => {
            return { ...element, fullName: `${element.nom} [${element.code}]` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  public showData(data) {
    this.currentEvent = data;
    this.onDialogMaximized(true);
    this.display = true;
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  hideDialog() {
    this.display = false;
  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }
  changeDateStart(e) {
    this.selectDateStart = moment(this.filterDateStart).format('YYYY-MM-DD');
  }
  changeDateEnd(e) {
    this.selectDateEnd = moment(this.filterDateEnd).format('YYYY-MM-DD');
  }

  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedimsi && !this.selectedDirection && !this.selectDateStart && !this.selectDateEnd) ? true : false

  }
}
