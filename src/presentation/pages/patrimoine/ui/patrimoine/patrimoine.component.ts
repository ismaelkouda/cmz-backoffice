import { PatrimoineService } from './../../data-access/patrimoine.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { GetAllPatrimoineUseCase } from 'src/domain/usecases/patrimoine/get-all-patrimoine.usecase';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-patrimoine',
  templateUrl: './patrimoine.component.html',
  styleUrls: ['./patrimoine.component.scss']
})
export class PatrimoineComponent implements OnInit {

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
  public listZones: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedSim: string;
  public selectedimsi: string
  public currentData: any;


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

  constructor(
    //private readonly getAllPatrimoineUseCase: GetAllPatrimoineUseCase,
    public toastrService: ToastrService,
    public settingService: SettingService,
    private patrimoineService: PatrimoineService,
    private clipboardApi: ClipboardService,
    private modalService: NgbModal,

  ) {

  }

  ngOnInit() {
    this.GetAllPatrimoines();
    this.getAllDirectionRegionales();
    this.isFilter();
    this.disableAction()
  }

  // public GetAllPatrimoines() {
  //   this.getAllPatrimoineUseCase
  //     .execute()
  //     .subscribe({
  //       next: (response) => {
  //         this.listPatrimoines = response.data
  //       },
  //       error: (error) => {
  //         this.toastrService.error(error.message);
  //       }
  //     })
  // }



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
    this.GetAllPatrimoines()
  }
  public onFilter() {
    this.patrimoineService
      .GetAllPatrimoines({
        direction_regionale_id: this.selectedDirection?.id,
        exploitation: this.selectedExploitation?.code,
        msisdn: this.selectedSim,
        imsi: this.selectedimsi
      }, 1)
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
  public getAllDirectionRegionales() {
    this.settingService
      .getAllDirectionRegionales({})
      .subscribe({
        next: (response) => {
          this.listDirections = response.data
        },
        error: (error) => {
          this.toastrService.error(error.message);
        }
      })
  }

  openForm(content, data) {
    this.currentData = data;
    this.modalService.open(content);
  }
  hideForm() {
    this.modalService.dismissAll();
  }

  onChangeItem(event: any) {
    this.selectedDirection = event.value;
    this.listExploitations = this.selectedDirection?.exploitations.map(element => {
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
        "<strong>Numero SIM :</strong>" + "<span>" + this.currentComposant.msisdn + "</span>" + "<br>" +
        "<strong>Direction Regionale :</strong>" + "<span>" + this.currentComposant?.direction_regionale.code + "</span>" + "<br>" +
        "<strong>Exploitation :</strong>" + "<span>" + this.currentComposant?.exploitation?.code + "</span>" + "<br>" +
        "<strong>Code Usage :</strong>" + "<span>" + this.currentComposant.usage + "</span>" + "<br>" +
        "</div>",
        //{direction: 'top',},
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
    return (!this.selectedDirection && !this.selectedSim && !this.selectedimsi) ? true : false
  }
  public disableAction(): boolean {
    return (this.listPatrimoines === undefined || this.listPatrimoines?.length === 0) ? true : false
  }
}
