import { ExcelService } from './../../../../../shared/services/excel.service';
import { MappingService } from './../../../../../shared/services/mapping.service';
import { SimStatut } from './../../../../../shared/enum/SimStatut.enum';
import { Activity } from './../../../../../shared/enum/Activity.enum';

import { PatrimoineService } from './../../data-access/patrimoine.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { QrModalComponent } from 'src/shared/components/qr-modal/qr-modal.component';
import { PATRIMOINE } from 'src/shared/routes/routes';
import { DOTATION_SERVICES, TRANSACTION_SIM } from '../../patrimoine-routing.module';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-carte-sim-active',
  templateUrl: './carte-sim-active.component.html',
  styleUrls: ['./carte-sim-active.component.scss']
})
export class CarteSimActiveComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentObject: any;
  public listPatrimoines: any;
  public display: boolean = false;
  public map: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public isMaximized: boolean = false;
  public currentComposant: any;
  public listDirections: Array<any> = [];
  public listExploitations: Array<any> = [];
  public listUsages: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: string;
  public selectedimsi: string;
  public selectedStatut: string;
  public selectedUsage: string;
  public selectedZone: string;
  public currentData: any;
  public listStatus: Array<any> = [];
  public selectedDescription: string;

  //SEMLEX
  public listActivites: Array<any> = [];
  public listDepartements: Array<any> = [];
  public listCommunes: Array<any> = [];
  public selectedDepartement: any;
  public selectedCommune: any;

  @ViewChild('parcelleMap') parcelleMap: ElementRef;

  OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'PATRIMOINE SIM-MAP',
    detectRetina: false,
    maxNativeZoom: 19,
    maxZoom: 23,
    minZoom: 12,
    noWrap: false,
    opacity: 1,
    subdomains: 'abc',
    tms: false,
  })
  satelite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 23,
    minZoom: 10,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: 'PATRIMOINE SIM-MAP',
  })

 public firstLevelLibelle: string;
 public secondLevelLibelle: string;
 public thirdLevelLibelle: string;
 public swap: string = OperationTransaction.SWAP;
 public suspension: string = OperationTransaction.SUSPENSION;
 public resiliation: string = OperationTransaction.RESILIATION;
 public volume: string = OperationTransaction.VOLUME_DATA;

  constructor(
    public toastrService: ToastrService,
    public settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private mappingService: MappingService,
    private router: Router,
    private excelService: ExcelService
  ) {
    this.listStatus = [SimStatut.ACTIF, SimStatut.SUSPENDU, SimStatut.RESILIE]    
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }

  ngOnInit() {
    this.GetAllPatrimoines();
    this.getAllDirectionRegionales();
    this.getAllZones();
    this.isFilter();
    this.disableAction();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[0];
    });
  }
  public GetAllPatrimoines() {
    this.patrimoineService
      .GetAllPatrimoines({}, this.p)
      .subscribe({
        next: (response) => {
          this.listPatrimoines = response.data.data;
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
    if (this.isFilter()) {
      this.GetAllPatrimoines()
    } else {
      this.onFilter()
    }
  }
  public onFilter() {
    this.patrimoineService
      .GetAllPatrimoines({
        niveau_un_id: this.selectedDirection?.id,
        niveau_deux_id: this.selectedExploitation?.id,
        niveau_trois_id: this.selectedUsage,
        msisdn: this.selectedSim,
        imsi: this.selectedimsi,
        zone_trafic: this.selectedZone,
        statut: this.selectedStatut,
      }, this.p)
      .subscribe({
        next: (response) => {
          this.listPatrimoines = response.data.data;
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

  OnRefresh() {
    this.GetAllPatrimoines();
    this.selectedDirection = null;
    this.selectedExploitation = null;
    this.selectedUsage = null;
    this.selectedSim = null;
    this.selectedimsi = null;
    this.selectedZone = null;
    this.selectedStatut = null;
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
          this.toastrService.error(error.error.message);
        }
      })
  }
  public GetAllDepartements() {
    this.patrimoineService
      .GetAllDepartements({})
      .subscribe({
        next: (response) => {
          this.listDepartements = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public getAllZones(): void {
    this.settingService
      .getAllZones({})
      .subscribe({
        next: (response) => {
          this.listActivites = response['data'];
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public GetAllUsages() {
    this.patrimoineService
      .GetAllUsages({})
      .subscribe({
        next: (response) => {
          this.listUsages = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  public suspensionForm(content, data) {
    this.currentData = { ...data, type: SimStatut.SUSPENDU };
    this.modalService.open(content);
  }
  public resilierForm(content, data) {
    this.currentData = { ...data, type: SimStatut.RESILIE };
    this.modalService.open(content);
  }
  public hideForm() {
    this.modalService.dismissAll();
  }
  public OnChangeStatut() {
    this.patrimoineService
      .OnChangeStatut({
        operation: this.currentData?.type,
        imsi: this.currentData?.imsi,
        description: this.selectedDescription
      })
      .subscribe({
        next: (response) => {
          this.GetAllPatrimoines();
          this.selectedDescription = null;
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
  public onInitForm(): void {
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
  public onTransactionForm(data: any,operation: string): void {
    this.initialView = false;
    this.router.navigateByUrl(
      `${PATRIMOINE}/${TRANSACTION_SIM}`,
      { state: {patrimoine: data,operation: operation} }
    );
  }
  public onDotationForm(data: any): void {
    this.initialView = false;
    this.router.navigateByUrl(
      `${PATRIMOINE}/${DOTATION_SERVICES}`,
      { state: {patrimoine: data} }
    );
  }

  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }

  public pushListPatrimoines(event: any): void {
    this.listPatrimoines = event;
  }

  public onMapReady() {
    var customIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
      iconSize: [45, 45],
      iconAnchor: [17, 17],
    });
    var  osmLayer = this.OpenStreetMap
    this.map = new L.Map('map');
    this.map.setView(new L.LatLng(this.currentComposant?.longitude, this.currentComposant?.latitude), 18);
    this.map.options.minZoom = 12;
    var marker = L.marker([this.currentComposant?.longitude, this.currentComposant?.latitude])
      .setIcon(customIcon)
      .bindPopup(
        "<div>" + "" +
        "<strong>Numero SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
        "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.direction_regionale?.nom + "</span>" + "<br>" +
        "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.exploitation?.nom + "</span>" + "<br>" +
        "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.zone?.nom + "</span>" + "<br>" +
        "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + this.currentComposant?.nom_prenoms + "</span>" + "<br>" +
        "<strong>Statut :</strong>" + "<span>" + this.currentComposant?.statut + "</span>" + "<br>" +
        "</div>",
      ).openPopup();
    marker.addTo(this.map);
    this.map.addLayer(osmLayer);
    var baseMaps = {
      'OpenStreetMap': this.OpenStreetMap.addTo(this.map),
      'Satellite': this.satelite
    }
    L.control.layers(baseMaps, {}, { collapsed: false }).addTo(this.map);
  }
  public showDialog(data, composant) {
    switch (data) {
      case "map": {
        this.display = true;
        this.onDialogMaximized(true);
        this.currentComposant = composant;
        setTimeout(() => {
          this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw'></div>";
          this.onMapReady();
        }, 1000);
        break;
      }
    }
  }
  public hideDialog(data) {
    switch (data) {
      case "map": {
        this.display = false;
        break;
      }
    }
  }
  public OnShowQr(data) {
    if (data.qrcode) {
      const modalRef = this.modalService.open(QrModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        keyboard: false,
        centered: true,
      });
      modalRef.componentInstance.qr = data;
    } else {
      Swal.fire("PATRIMOINE SIM", "Aucun QRCode enregistré", "info");
    }
  }
  public fileChangeEvent(event: any) {

  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedSim && !this.selectedimsi && !this.selectedStatut && !this.selectedUsage && !this.selectedZone) ? true : false
  }
  public disableAction(): boolean {
    return (this.listPatrimoines === undefined || this.listPatrimoines?.length === 0) ? true : false
  }

  public OnExportExcel(): void {
    const data = this.listPatrimoines.map((item: any) => ({
      [this.firstLevelLibelle]: item?.direction_regionale?.nom,
      [this.secondLevelLibelle]: item?.exploitation?.nom,
       'Zone Trafic': item?.adresse_geographique,
       [this.thirdLevelLibelle]: item?.zone?.nom,
      'MSISDN': item?.msisdn,
      'IMSI': item?.imsi,
      'Emplacement': item?.nom_prenoms,
       'Statut': item?.statut,
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des cartes SIM');
  }
}
