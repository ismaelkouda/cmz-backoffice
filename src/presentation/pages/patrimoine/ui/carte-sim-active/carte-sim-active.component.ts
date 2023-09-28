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
import { ActivatedRoute } from '@angular/router';
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
    maxZoom: 19,
    minZoom: 12,
    noWrap: false,
    opacity: 1,
    subdomains: 'abc',
    tms: false,
  })
  satelite = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'PATRIMOINE SIM-MAP',
    detectRetina: false,
    maxNativeZoom: 19,
    maxZoom: 19,
    minZoom: 12,
    noWrap: false,
    opacity: 1,
    subdomains: 'abc',
    tms: false,
  })


  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;

  constructor(
    public toastrService: ToastrService,
    public settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private mappingService: MappingService
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
          this.toastrService.error(error.message);
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
          this.toastrService.error(error.message);
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
          this.toastrService.error(error.message);
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
          this.toastrService.error(error.message);
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
          this.toastrService.error(error.message)
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
          this.toastrService.error(error.message);
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
    var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      osmLayer = new L.TileLayer(osmUrl, { attribution: 'VUE GEOGRAPHIQUE', detectRetina: false, maxNativeZoom: 19, maxZoom: 19, minZoom: 12, noWrap: false, opacity: 1, subdomains: 'abc', tms: false });
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
      'OpenStreetMap': this.OpenStreetMap,
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
    return (!this.selectedDirection && !this.selectedSim && !this.selectedimsi && !this.selectedStatut && !this.selectedUsage) ? true : false
  }
  public disableAction(): boolean {
    return (this.listPatrimoines === undefined || this.listPatrimoines?.length === 0) ? true : false
  }
}
