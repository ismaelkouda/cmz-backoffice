import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MappingService } from './../../../../../shared/services/mapping.service';
import { PatrimoineService } from './../../data-access/patrimoine.service';
import * as L from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicationType } from 'src/shared/enum/ApplicationType.enum';
const Swal = require('sweetalert2');


@Component({
  selector: 'app-cartographie',
  templateUrl: './cartographie.component.html',
  styleUrls: ['./cartographie.component.scss']
})
export class CartographieComponent implements OnInit {

  public module: string;
  public subModule: string;
  public initialView: boolean = true;
  public formsView: boolean = false;
  public currentData: any;
  public listPatrimoines: any;
  public display: boolean = false;
  public map: any;
  public isMaximized: boolean = false;
  public currentComposant: any;
  public listFirstLeveDatas: Array<any> = [];
  public listSecondLevelDatas: Array<any> = [];
  public listThirdLevelDatas: Array<any> = [];
  public selectedDirection: any;
  public selectedExploitation: any;
  public selectedNiveauTrois: string;
  public selectedZone: string;

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
 public applicationType: string;
 public patrimoineType: string;

  constructor(
    public toastrService: ToastrService,
    public settingService: SettingService,
    private route: ActivatedRoute,
    public mappingService: MappingService,
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
    this.applicationType = this.mappingService.applicationType;
    this.patrimoineType = ApplicationType.PATRIMOINESIM;      
  }

  ngOnInit() {
    this.GetAllFirstLevel();
    this.GetAllThirdLevel();
    this.isFilter();
    this.route.data.subscribe((data) => {
      this.module = data.module;
      this.subModule = data.subModule[5];
    });
  }
  OnRefresh() {
    
  }
  public GetAllFirstLevel() {
    this.settingService
      .GetAllFirstLevelSimple({})
      .subscribe({
        next: (response) => {
          this.listFirstLeveDatas = response['data'].map(element => {
            return { ...element, fullName: `${element.nom}` }
          });
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  onChangeFirstLvel(event: any) {
    this.selectedDirection = event.value;
    this.listSecondLevelDatas = this.selectedDirection?.niveaux_deux.map(element => {
      return { ...element, fullName: `${element.nom}` }
    });
  }
  public GetAllThirdLevel() {
    this.settingService
      .GetAllThirdSimple({})
      .subscribe({
        next: (response) => {
          this.listThirdLevelDatas = response['data']
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }
  onFilter(){}
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
        "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
        "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
        "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
        "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + this.currentComposant?.point_emplacement + "</span>" + "<br>" +
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

  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  public isFilter(): boolean {
    return (!this.selectedDirection && !this.selectedExploitation && !this.selectedZone && !this.selectedNiveauTrois) ? true : false
  }
}



