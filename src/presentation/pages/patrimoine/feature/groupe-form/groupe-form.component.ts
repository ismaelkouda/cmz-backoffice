import { SettingService } from './../../../../../shared/services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MappingService } from 'src/shared/services/mapping.service';
import { ClipboardService } from 'ngx-clipboard';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PatrimoineService } from '../../data-access/patrimoine.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-groupe-form',
  templateUrl: './groupe-form.component.html',
  styleUrls: ['./groupe-form.component.scss']
})
export class GroupeFormComponent implements OnInit {

  listAffectations: any[] = [];
  listGroupes: any[] = [];
  @Output() formsView = new EventEmitter();
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
  public selectedMsisdn: string;
  public selectedImsi: string;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public adminForm: FormGroup;
  public selectedGroupe: string;
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public currentObservable : Observable<any>;

  constructor(
    private toastrService: ToastrService,
    private patrimoineService: PatrimoineService,
    private settingService: SettingService,
    private mappingService: MappingService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private fb: FormBuilder,

  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }
  ngOnInit() {
    if (!this.currentObject) {
      this.GetAllPatrimoines();
    }else if (this.currentObject?.type === 'affectation') {
      this.GetAllSimNoGroupe();
    } else if (this.currentObject?.type === 'visualiser' || this.currentObject?.type === 'show') {
      this.GetAllsimAtGroupe();
    } else if (this.currentObject?.type === 'edit') {
      this.GetAllSimNoGroupe();
    } 
    this.GetFirstLevelDatas();
    this.isFilter();
    this.initForm();
    this.onFormPachValues()
  }
  public GetAllGroupes(): void {
    this.patrimoineService
      .GetAllGroupes({})
      .subscribe({
        next: (response) => {
          this.listProfils.emit(response['data']);
          this.listGroupes = response['data'];
          this.close()
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAll(): void {
    this.patrimoineService
      .GetAllGroupes({})
      .subscribe({
        next: (response) => {
          this.listGroupes = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllPatrimoines() {
    this.patrimoineService
      .GetAllPatrimoines({}, this.p)
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
  public GetAllSimNoGroupe() {
    this.patrimoineService
      .GetAllSimNoGroupe(
        {
          groupe_id: this.currentObject?.id
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
  public GetAllsimAtGroupe() {
    this.patrimoineService
      .GetAllsimAtGroupe(
        {
          groupe_id: this.currentObject?.id
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
  public OnRefresh(){
    if (!this.currentObject) {
      this.GetAllPatrimoines();
    }else if (this.currentObject?.type === 'affectation') {
      this.GetAllSimNoGroupe();
    } else if (this.currentObject?.type === 'visualiser' || this.currentObject?.type === 'show') {
      this.GetAllsimAtGroupe();
    } else if (this.currentObject?.type === 'edit') {
      this.GetAllSimNoGroupe();
    } 
    this.selectedDirection = null
    this.selectedExploitation = null
    this.selectedImsi = null
    this.selectedMsisdn = null
  }

 
  public OnFilterALl() { 
    
    if (!this.currentObject) {
      this.currentObservable = this.patrimoineService.GetAllPatrimoines({
        niveau_un_id: this.selectedDirection?.id,
        niveau_deux_id: this.selectedExploitation?.id,
        imsi: this.selectedImsi,
        msisdn: this.selectedMsisdn
      }, this.p);
    }else if (this.currentObject?.type === 'affectation') {
        this.currentObservable = this.patrimoineService.GetAllSimNoGroupe({
          groupe_id: this.currentObject?.id,
          niveau_un_id: this.selectedDirection?.id,
          niveau_deux_id: this.selectedExploitation?.id,
          imsi: this.selectedImsi,
          msisdn: this.selectedMsisdn
        }, this.p);
      } else if (this.currentObject?.type === 'visualiser' || this.currentObject?.type === 'show') {        
        this.currentObservable = this.patrimoineService.GetAllsimAtGroupe({
          groupe_id: this.currentObject?.id,
          niveau_un_id: this.selectedDirection?.id,
          niveau_deux_id: this.selectedExploitation?.id,
          imsi: this.selectedImsi,
          msisdn: this.selectedMsisdn
        }, this.p);
      } else if (this.currentObject?.type === 'edit') {
        this.currentObservable = this.patrimoineService.GetAllSimNoGroupe({
          groupe_id: this.currentObject?.id,
          niveau_un_id: this.selectedDirection?.id,
          niveau_deux_id: this.selectedExploitation?.id,
          imsi: this.selectedImsi,
          msisdn: this.selectedMsisdn
        }, this.p);
      }
      this.currentObservable.subscribe({
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
    this.GetAllSimNoGroupe()
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

  public HandleSaveGroupe() {
    this.patrimoineService
      .HandleSaveGroupe({
        ...this.adminForm.value,
        sims: this.checkconsumerList
      }).subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.GetAllGroupes();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public HandleUpdateGroupe() {
    this.patrimoineService
      .HandleUpdateGroupe({
        ...this.adminForm.value,
        groupe_sim_id: this.currentObject?.id,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.adminForm.reset();
          this.GetAllGroupes();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  public handleSaveAffectation() {
    this.patrimoineService
      .handleSaveAffectation({
        groupe_id: this.currentObject?.id,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllGroupes();
          this.toastrService.success(response.message);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public handleSaveReaffectation() {
    this.patrimoineService
      .handleSaveReaffectation({
        groupe_id: this.selectedGroupe,
        sims: this.checkconsumerList
      })
      .subscribe({
        next: (response) => {
          this.GetAllGroupes();
          this.hideForm();
          this.adminForm.reset();
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
        this.patrimoineService
          .handleRetraitSim({
            profil_id: this.currentObject?.id,
            sims: this.checkconsumerList
          })
          .subscribe({
            next: (response) => {
              this.GetAllGroupes();
              this.adminForm.reset();
              this.toastrService.success(response.message);
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }

  public close(): void {
    this.formsView.emit(false);
  }

  public initForm(): void {
    this.adminForm = this.fb.group({
      nom: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }
  openForm(content) {
    this.GetAll();
    this.modalService.open(content);
  }
  hideForm() {
    this.modalService.dismissAll();
    this.selectedGroupe = undefined;
  }
  public onFormPachValues(): void {
    this.adminForm.get('nom').patchValue(this.currentObject?.nom);
    this.adminForm.get('description').patchValue(this.currentObject?.description);
    if (this.currentObject?.type === 'show') {
      this.adminForm.disable()
    }
  }
  public GetFirstLevelDatas() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirections = response['data'].map(element => {
            return { ...element, fullName: `${element.nom} [${element.code}]` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
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
  
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedExploitation && !this.selectedImsi && !this.selectedMsisdn) ? true : false
  }

}

