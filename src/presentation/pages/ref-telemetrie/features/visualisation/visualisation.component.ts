import { SettingService } from './../../../../../shared/services/setting.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { TelemetrieService } from '../../data-access/telemetrie.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MappingService } from 'src/shared/services/mapping.service';
import { ClipboardService } from 'ngx-clipboard';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-visualisation',
  templateUrl: './visualisation.component.html',
  styleUrls: ['./visualisation.component.scss']
})
export class VisualisationComponent implements OnInit {

  @Output() visualisationView = new EventEmitter();
  @Input() currentObject;
  @Output() listProfils = new EventEmitter();
  public listDatas: Array<any> = [];
  public display: boolean = false;
  public listAffectations: any[] = [];
  public checkedAllConsumers: boolean = false;
  public checkedconsumer: boolean = false;
  public listconfigCheckedTrue: Array<any> = [];
  public checkconsumerList: Array<any> = [];
  public selectedProfil: any;
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listZones: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: any;
  public selectedimsi: any;
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
    private telemetrieService: TelemetrieService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private settingService: SettingService,
    private mappingService: MappingService,
    private clipboardApi: ClipboardService,

  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.GetAllListSimAffecte();
    this.getAllDirectionRegionales()
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
  public GetAllProfilSupervisions(): void {
    this.telemetrieService
      .GetAllProfilSupervision({})
      .subscribe({
        next: (response) => {
          this.listDatas = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllListSimAffecte() {
    this.telemetrieService
      .GetAllListSimAffecte({
        profil_id: this.currentObject?.id
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listAffectations = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    this.GetAllListSimAffecte()
  }
  public onFilter() {
    this.telemetrieService
      .GetAllListSimAffecte({
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
    this.visualisationView.emit(false);
  }
  openForm(content) {
    this.GetAllProfilSupervisions();
    this.modalService.open(content);
  }
  hideForm() {
    this.modalService.dismissAll();
    this.selectedProfil = undefined;
  }
  public handleSaveReaffectation() {
    this.telemetrieService
      .handleSaveReaffectation({
        profil_id: this.selectedProfil?.id,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllProfilSupervision();
          this.hideForm();
          this.selectedProfil = undefined;
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public handleRetraitSim(): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous retirer ce(s) SIM(s)`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.telemetrieService
          .handleRetraitSim({
            profil_id: this.currentObject?.id,
            sims: this.checkconsumerList
          })
          .subscribe({
            next: (response) => {
              this.GetAllProfilSupervision();
              this.selectedProfil = undefined;
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedExploitation && !this.selectedimsi) ? true : false
  }
}
