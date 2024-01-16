import { SettingService } from './../../../../../shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-affectation-sim',
  templateUrl: './affectation-sim.component.html',
  styleUrls: ['./affectation-sim.component.scss']
})
export class AffectationSimComponent implements OnInit {

  listAffectations: any[] = [];
  @Output() affectationView = new EventEmitter();
  @Input() currentObject;
  @Output() listProfils = new EventEmitter();
  public display: boolean = false;
  public checkedAllConsumers: boolean = false;
  public checkedconsumer: boolean = false;
  public listconfigCheckedTrue: any[] = [];
  public checkconsumerList: any[] = [];
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: any;
  public selectedimsi: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0

  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;

  constructor(
    private toastrService: ToastrService,
    private telemetrieService: TelemetrieService,
    private settingService: SettingService,
    private mappingService: MappingService,
    private clipboardApi: ClipboardService,

  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }
  ngOnInit() {
    this.GetAllListAffectationBySim();
    this.getAllDirectionRegionales();
    this.isFilter()
  }

  public GetAllProfilSupervision(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
      .subscribe({
        next: (response) => {
          this.listProfils.emit(response['data']);
          this.close();
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }


  public GetAllListAffectationBySim() {
    this.telemetrieService
      .GetAllListAffectationBySim(
        {
          profil_id: this.currentObject?.id
        }, this.p)
      .subscribe({
        next: (response) => {
          this.listAffectations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllListAffectationBySim()
  }
  public onCheckedOneConsumer(consumer: any) {
    if (this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.forEach((value, index) => {
        if (value == consumer.id)
          this.checkconsumerList.splice(index, 1);
      });
    } else if (!this.checkconsumerList.includes(consumer.id)) {
      this.checkconsumerList.push(consumer.id);
    }
    if (this.checkconsumerList.length === this.listAffectations.length) {
      this.checkedAllConsumers = true;
    } else {
      this.checkedAllConsumers = false;
    }
  }
  public OnCheckAllConsumer() {
    this.checkconsumerList = [];
    if (this.checkedAllConsumers) {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = true;
        this.checkconsumerList.push(consumer.id);
      });
    } else {
      this.listAffectations.forEach((consumer) => {
        consumer.checked = false;
      });
      this.checkconsumerList.splice(0, this.checkconsumerList.length);
    }
  }
  public close(): void {
    this.affectationView.emit(false);
  }

  public handleSaveAffectation() {
    this.telemetrieService
      .handleSaveAffectation({
        profil_id: this.currentObject?.id,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllProfilSupervision();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
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

  public onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom} [${element.code}]` }
    });
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public onFilter() {
    this.telemetrieService
      .GetAllListAffectationBySim({
        profil_id: this.currentObject?.id,
        niveau_un_id: this.selectedDirection?.id,
        niveau_deux_id: this.selectedExploitation?.id,
        imsi: this.selectedimsi
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listAffectations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedExploitation && !this.selectedimsi) ? true : false
  }

}
