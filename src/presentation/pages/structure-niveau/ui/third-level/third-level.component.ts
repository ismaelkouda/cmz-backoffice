import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ExcelService } from 'src/shared/services/excel.service';
import { MappingService } from 'src/shared/services/mapping.service';
import { SettingService } from 'src/shared/services/setting.service';
import { FormValidator } from 'src/shared/utils/spacer.validator';
import { Title } from '@angular/platform-browser';
import { StoreCurrentUserService } from '../../../../../shared/services/store-current-user.service';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-third-level',
  templateUrl: './third-level.component.html',
  styleUrls: ['./third-level.component.scss']
})
export class ThirdLevelComponent implements OnInit {

  public initialView: boolean = true;
  public formsView: boolean = false;
  public affectationView: boolean = false;
  public visualisationView: boolean = false;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public currentObject: any;
  public listCurrentLevelDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public selectedNom: string;
  public selectedCode: string;
  public selectedCodes: string;
  public currentLevelLibelle: string | undefined;
  public currentLevelMenus: string | undefined;
  public currentLevel: any;
  public adminForm: FormGroup;
  public currentTabsIndex: number = 0;
  public title = '3ème niveau - Système de Gestion de Collecte Centralisée';
  constructor(
    private settingService: SettingService,
    private toastrService: ToastrService,
    public mappingService: MappingService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private clipboardApi: ClipboardService,
    private titleService: Title,
    private fb: FormBuilder,
    private storeCurrentUserService: StoreCurrentUserService
  ) {
    this.titleService.setTitle(`${this.title}`);
    const currentUser = this.storeCurrentUserService.getCurrentUser;
    this.currentLevelLibelle = currentUser?.structure_organisationnelle?.niveau_3;
    this.currentLevelMenus = currentUser?.structure_organisationnelle?.niveau_3_menu;
  }

  ngOnInit() {
    this.GellCurrentLevel();
    this.GellAllSecondLevel();
    this.onInitForm();
    this.isFilter();
  }

  public GellCurrentLevel() {
    this.settingService
      .getAllZones({},this.p)
      .subscribe({
        next: (response) => {
          this.listCurrentLevelDatas = response.data.data;
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

  public onFilter() {
    this.settingService
      .getAllZones({
        nom: this.selectedNom,
        code: this.selectedCodes
      },this.p)
      .subscribe({
        next: (response) => {
          this.listCurrentLevelDatas = response.data.data;
          this.totalPage = response.data.last_page;
          this.totalRecords = response.data.total;
          this.recordsPerPage = response.data.per_page;
          this.page = response.data?.current_page;
          this.offset = (response.data.current_page - 1) * this.recordsPerPage + 1;                 
        ''},
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }
  public onPageChange(event) {
    this.p = event;
    if (this.isFilter()) {
      this.GellCurrentLevel()
    } else {
      this.onFilter()
    }
  }
  public OnRefresh(){
    this.p = 1;
    this.GellCurrentLevel();
    this.selectedNom = null
    this.selectedCode = null
  }

  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public GellAllSecondLevel() {
    this.settingService
      .GetAllSecondLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listSecondLevelDatas = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  onInitForm() {
    this.adminForm = this.fb.group({
      nom: ['', [
        Validators.required,
        FormValidator.cannotContainSpace
      ]],
      code: ['', [
        Validators.required,
        FormValidator.cannotContainSpace,
        FormValidator.symbolsOnly,
      ]]   
    })
  }
  public openForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = undefined;
  }
  public onEditForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = data;
  }
  public onShowForm(data: any): void {
    this.initialView = false;
    this.formsView = true;
    this.currentObject = { ...data, show: true };
  }
  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }
  public pushListDatas(event: any): void {
    this.listCurrentLevelDatas = event;
  }

  handleChangeTabviewIndex(e) {
    this.currentTabsIndex = e.index;
  }
  hideForm() {
    this.modalService.dismissAll();
    this.adminForm.reset();
  }

  public handleActivate(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Activer <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
          .handleActivateZone(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GellCurrentLevel();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public handleDisable(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Désactiver <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
          .handleDisableZone(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GellCurrentLevel();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public HandleDelete(data: any): void {
    Swal.fire({
      title: 'En êtes vous sûr ?',
      html: `Voulez-vous Supprimer <br> ${data.nom} ?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#569C5B',
      cancelButtonColor: '#dc3545',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Oui',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService
          .HandleDeleteZone(data.id)
          .subscribe({
            next: (response) => {
              this.toastrService.success(response.message);
              this.GellCurrentLevel();
            },
            error: (error) => {
              this.toastrService.error(error.error.message);
            }
          })
      }
    });
  }
  public OnExportExcel(): void {
    const data = this.listCurrentLevelDatas.map((item: any) => ({
      [this.currentLevelLibelle]: item?.nom,
      'Code': item?.code,
      'Statut': item?.statut
    }));
    this.excelService.exportAsExcelFile(data, `Lise des ${this.currentLevelLibelle}`);
  }
  public isFilter(): boolean {
    return (!this.selectedNom && !this.selectedCodes) ? true : false
  }
}
