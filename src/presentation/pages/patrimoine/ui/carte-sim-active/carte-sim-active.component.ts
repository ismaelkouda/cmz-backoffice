import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DEMANDE_FORMULE_CHANGE, DEMANDE_RESILIATION, DEMANDE_SWAPPING } from './../../../demandes/demandes-routing.module';
import { ExcelService } from './../../../../../shared/services/excel.service';
import { MappingService } from './../../../../../shared/services/mapping.service';
import { SimStatut } from './../../../../../shared/enum/SimStatut.enum';
import { PatrimoineService } from './../../data-access/patrimoine.service';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { QrModalComponent } from 'src/shared/components/qr-modal/qr-modal.component';
import { DEMANDE_SERVICE, PATRIMOINE } from 'src/shared/routes/routes';
import { CARTES_SIM, DOTATION_SERVICES } from '../../patrimoine-routing.module';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
import { DEMANDE_ACTIVATION, DEMANDE_SUSPENSION } from 'src/presentation/pages/demandes/demandes-routing.module';
import { Title } from '@angular/platform-browser';
import { handle } from 'src/shared/functions/api.function';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { Pargination } from 'src/shared/table/pargination';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
const Swal = require('sweetalert2');

@Component({
  selector: 'app-carte-sim-active',
  templateUrl: './carte-sim-active.component.html'
})

export class CarteSimActiveComponent implements OnInit {
  public itemCatreSim: {};
  public pargination = new Pargination(1, 50, 0, 0, 0, 1, 0);
  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentData: any;
  public listPatrimoines: any;
  public display: boolean = false;
  public map: any;
  public totalPage: 0;
  public totalRecords: 0;
  public recordsPerPage: 0;
  public offset: any;
  public p: number = 1;
  public page: number = 0
  public isMaximized: boolean = false;
  public currentComposant: any;
  public currentOperation: any;
  public selectedDescription: string;
  public dataToSend: any = {};
  private response: any = {};

  @ViewChild('parcelleMap') parcelleMap: ElementRef;

  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
  public applicationType: string;
  public patrimoineType: string;
  public activation: string = OperationTransaction.ACTIVATION;
  public swap: string = OperationTransaction.SWAP;
  public suspension: string = OperationTransaction.SUSPENSION;
  public resiliation: string = OperationTransaction.RESILIATION;
  public formule: string = OperationTransaction.CHANGEMENT_FORMULE;
  public volume: string = OperationTransaction.VOLUME_DATA;
  public title = 'Carte SIM actives - Système de Gestion de Collecte Centralisée';
  constructor(public toastrService: ToastrService, public settingService: SettingService,
    private patrimoineService: PatrimoineService, private clipboardApi: ClipboardService,
    private modalService: NgbModal, private route: ActivatedRoute,
    public mappingService: MappingService, private router: Router,
    private titleService: Title, private excelService: ExcelService, private loadingBar: LoadingBarService
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;
    this.titleService.setTitle(`${this.title}`);
  }

  ngOnInit() {
    this.pageCallback({ statut: history?.state?.statut });
    this.disableAction();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[0];
    });
  }

  public onPageChange(event: number) {
    this.p = event;
    this.pageCallback(this.dataToSend, event + 1);
  }

  public filter(dataToSend: {}): void {
    this.dataToSend = dataToSend;
    this.pageCallback(dataToSend);
  }

  async pageCallback(dataToSend = {}, nbrPage: number = 1) {
    this.response = await handle(() => this.patrimoineService.GetAllPatrimoines(dataToSend, nbrPage), this.toastrService, this.loadingBar);
    this.handleSuccessfulPageCallback(this.response);
  }

  private handleSuccessfulPageCallback(response): void {
    this.listPatrimoines = response.data.data;
    this.pargination = new Pargination(response?.data?.p, response?.data?.to, response?.data?.last_page, response?.data?.total, response?.data?.per_page, response?.data?.current_page, (response?.data?.current_page - 1) * this.pargination?.per_page + 1);
  }

  public OnExportExcel(): void {
    const data = this.listPatrimoines.map((item: any) => ({
      [this.firstLevelLibelle]: item?.niveau_uns_nom,
      [this.secondLevelLibelle]: item?.niveau_deux_nom,
      'Zone Trafic': item?.adresse_geographique,
      [this.thirdLevelLibelle]: item?.niveau_trois_nom,
      'MSISDN': item?.msisdn,
      'IMSI': item?.imsi,
      'Emplacement': item?.point_emplacement,
      'Statut Contrat': item?.statut
    }));
    this.excelService.exportAsExcelFile(data, 'Liste des cartes SIM');
  }









  


  public suspensionForm(content, data) {
    this.currentOperation = { ...data, type: SimStatut.SUSPENDU };
    this.modalService.open(content);
  }

  public resilierForm(content, data) {
    this.currentOperation = { ...data, type: SimStatut.RESILIE };
    this.modalService.open(content);
  }

  public hideForm() {
    this.modalService.dismissAll();
  }

  async OnChangeStatut() {
    const dataToSend = { operation: this.currentOperation?.type, imsi: this.currentOperation?.imsi, description: this.selectedDescription };
    this.response = await handle(() => this.patrimoineService.OnChangeStatut(dataToSend), this.toastrService, this.loadingBar);
    this.handleSuccessfulOnChangeStatut(this.response);
  }

  private handleSuccessfulOnChangeStatut(response): void {
    this.pageCallback(this.dataToSend);
    // this.GetAllPatrimoines();
    this.selectedDescription = null;
  }

  public onInitForm(): void {
    this.initialView = false;
    this.formsView = true;
    this.currentData = undefined;
  }

  public onEditForm(data: any): void {
    this.onMarkItemCarteSim(data);
    this.initialView = false;
    this.formsView = true;
    this.currentData = data;
  }

  public onShowForm(data: any): void {
    this.onMarkItemCarteSim(data);
    this.initialView = false;
    this.formsView = true;
    this.currentData = { ...data, show: true };
  }

  public onTransactionForm(data: any, operation: string): void {
    this.onMarkItemCarteSim(data);
    this.initialView = false;
    let url: string;
    switch (operation) {
      case this.activation:
        url = `${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`;
        break;
      case this.suspension:
        url = `${DEMANDE_SERVICE}/${DEMANDE_SUSPENSION}`;
        break;
      case this.resiliation:
        url = `${DEMANDE_SERVICE}/${DEMANDE_RESILIATION}`;
        break;
      case this.swap:
        url = `${DEMANDE_SERVICE}/${DEMANDE_SWAPPING}`;
        break;
      case this.formule:
        url = `${DEMANDE_SERVICE}/${DEMANDE_FORMULE_CHANGE}`;
        break;
      default:
        url = `${PATRIMOINE}/${CARTES_SIM}`;
    }
    this.router.navigateByUrl(url, { state: { patrimoine: data, operation: operation } });
  }

  public onDotationForm(data: any): void {
    this.onMarkItemCarteSim(data);
    this.initialView = false;
    this.router.navigateByUrl(
      `${PATRIMOINE}/${DOTATION_SERVICES}`,
      { state: { patrimoine: data } }
    );
  }

  public pushStatutView(event: boolean): void {
    this.formsView = event;
    this.initialView = !event;
  }

  public pushListPatrimoines(event: any): void {
    this.listPatrimoines = event;
  }

  onMarkItemCarteSim(data) {
    this.itemCatreSim = data;
  }
  
  public OnShowQr(data) {
    this.onMarkItemCarteSim(data);
    if (data.qrcode) {
      const modalRef = this.modalService.open(QrModalComponent, {...ModalParams, backdrop: true, keyboard: true});
      modalRef.componentInstance.qr = data;
    } else {
      Swal.fire("PATRIMOINE SIM", "Aucun QRCode enregistré", "info");
    }
  }

  public onMapReady() {
    var traficIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
      iconSize: [45, 45],
      iconAnchor: [17, 17],
    });
    var networkIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
      iconSize: [45, 45],
      iconAnchor: [17, 17],
    });
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmLayer = new L.TileLayer(osmUrl, { attribution: 'CARTE SIM', detectRetina: false, maxNativeZoom: 19, maxZoom: 23, minZoom: 12, noWrap: false, opacity: 1, subdomains: 'abc', tms: false });
    this.map = new L.Map('map');
    this.map.setView(new L.LatLng(this.currentComposant?.longitude ?? this.currentComposant?.long_reseau, this.currentComposant?.latitude ?? this.currentComposant?.lat_reseau), 18);
    this.map.options.minZoom = 12;

    const openstreetmap = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'PATRIMOINE SIM-MAP',
      detectRetina: false,
      maxNativeZoom: 19,
      maxZoom: 23,
      minZoom: 12,
      noWrap: false,
      opacity: 1,
      subdomains: 'abc',
      tms: false,
    }).addTo(this.map)
    const googlemap = new L.TileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 23,
      minZoom: 10,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'PATRIMOINE SIM-MAP',
    })
    var traficPoint = L.marker([this.currentComposant?.longitude ?? this.currentComposant?.long_reseau, this.currentComposant?.latitude ?? this.currentComposant?.lat_reseau])
      .setIcon(traficIcon)
      .bindPopup(
        "<div>" + "" +
        "<strong>Numéro SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
        "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
        "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
        "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
        "<strong>" + "Type d'emplacement :" + "</strong>" + "<span>" + `${this.currentComposant?.type_emplacement ?? ""}` + "</span>" + "<br>" +
        "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + `${this.currentComposant?.point_emplacement ?? ""}` + "</span>" + "<br>" +
        "<strong>Statut :</strong>" + "<span>" + `${this.currentComposant?.statut ?? ""}` + "</span>" + "<br>" +
        "<strong>Coordonnées GPS :</strong>" + "<span>" + `${this.currentComposant?.longitude ?? ""}` + "," + `${this.currentComposant?.latitude ?? ""}` + "</span>" + "<br>" +
        "</div>"
      ).openPopup();

    var reseauPoint = L.marker([this.currentComposant?.long_reseau, this.currentComposant?.lat_reseau])
      .setIcon(networkIcon)
      .bindPopup(
        "<div>" + "" +
        "<strong>Numéro SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
        "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
        "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
        "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
        "<strong>" + "Type d'emplacement :" + "</strong>" + "<span>" + `${this.currentComposant?.type_emplacement ?? ""}` + "</span>" + "<br>" +
        "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + `${this.currentComposant?.point_emplacement ?? ""}` + "</span>" + "<br>" +
        "<strong>" + "Geoloc :" + "</strong>" + "<span>" + this.currentComposant?.adresse_geographique + "</span>" + "<br>" +
        "<strong>" + "Quartier :" + "</strong>" + "<span>" + `${this.currentComposant?.quartier ?? ""}` + "</span>" + "<br>" +
        "<strong>" + "Statut :" + "</strong>" + "<span>" + `${this.currentComposant?.statut ?? ""}` + "</span>" + "<br>" +
        "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + `${this.currentComposant?.date_id ?? ""}` + "</span>" + "<br>" +
        "<strong>" + "Coordonnées GPS :" + "</strong>" + "<span>" + `${this.currentComposant?.long_reseau ?? ""}` + "," + `${this.currentComposant?.lat_reseau ?? ""}` + "</span>" + "<br>" +
        "</div>"
      ).openPopup();

    traficPoint.addTo(this.map);
    reseauPoint.addTo(this.map);
    this.map.addLayer(osmLayer);
    var baseMaps = {
      'OpenStreetMap': openstreetmap,
      'Satellite': googlemap
    }
    var layerGeoJson = {
      "<span style='font-weight:bold;'><b>Position déclarée</b></span><span><img src='assets/svg/sim_loc_noir.svg' style='width: 10px; margin-left: 20px;'/></span>": traficPoint,
      "<span style='font-weight:bold'><b>Position trafic</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px;'/></span>": reseauPoint,
    }
    L.control.layers(baseMaps, layerGeoJson, { collapsed: false }).addTo(this.map);
  }
  public showDialog(data, composant) {
    console.log('composant', composant)
    this.onMarkItemCarteSim(data);
    switch (data) {
      case "map": {
        this.display = true;
        this.onDialogMaximized(true);
        this.currentComposant = composant;
        // this.OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //   attribution: 'PATRIMOINE SIM-MAP',
        //   detectRetina: false,
        //   maxNativeZoom: 19,
        //   maxZoom: 23,
        //   minZoom: 12,
        //   noWrap: false,
        //   opacity: 1,
        //   subdomains: 'abc',
        //   tms: false,
        // })
        // this.satelite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        //   maxZoom: 23,
        //   minZoom: 10,
        //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        //   attribution: 'PATRIMOINE SIM-MAP',
        // })
        setTimeout(() => {
          this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw'></div>";
          this.onMapReady();
        }, 1500);
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
  public fileChangeEvent(event: any) {

  }
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }

  public disableAction(): boolean {
    return (this.listPatrimoines === undefined || this.listPatrimoines?.length === 0) ? true : false
  }

}

