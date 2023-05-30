import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NgbAccordionConfig, } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carte',
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.scss'],
})
export class CarteComponent implements AfterViewInit {
  @Input() datas;
  response: any;
  commentaire: any;
  json: any;
  latLongs: any;
  layerDetails: any = '';
  saifExist: any;
  urlMap: any;
  trustUrl: any;
  public sidebarShow: boolean = false;
  arrayLatLong: any = [];
  latLongArrayReverse: any = [];
  API_URL: any;
  public selectedActeur: string = 'DTC';
  isCertifieDTC: string;
  isCertifieDCAD: string;
  isCertifieAGEROUTE: string;
  dataDTC: any;
  dataDCAD: any;
  dataAGEROUTE: any;
  idufci: string;
  activatedRoute: string;
  correctKey: any;
  layerActif: string = 'actif';
  layerInactif: string = 'inactif';
  layerRetire: boolean = true;
  layerRessort: boolean = true;
  type_dataset: any;
  layers: L.Layer[] = [];
  location: any;
  parcelleData: any;

  OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'PATRIMOINE SIM-MAP',
    detectRetina: false,
    maxNativeZoom: 19,
    maxZoom: 19,
    // minZoom: 12,
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
    // minZoom: 12,
    noWrap: false,
    opacity: 1,
    subdomains: 'abc',
    tms: false,
  })
  geoJsonActif = null;
  geoJsonInactif = null;
  geoJsonRetire = null;
  geoJsonRessort = null;
  geojsonCentroid = null;
  layerParcelleActif: any;
  layerParcelleInactif: any;
  layerParcelleRetire: any;
  layerParcelleRessort: any;
  layer: any;
  showLayer: boolean = false;
  extended: boolean = false;
  map: any;
  selectedCart: string = 'firstCart';
  public checkboxStates: any;
  public selectedCouche: any = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  @ViewChild('parcelleMap') parcelleMap: ElementRef;
  @Input() maxi: boolean;
  selectedMaximized: any;

  dataReady: any;
  selectedStates: string[] = [];

  constructor(
    config: NgbAccordionConfig,
    private router: Router,
  ) {
    this.activatedRoute = this.router.url;
    config.closeOthers = true;

  }

  /**
   * @author André ATCHORI
   */

  public ngAfterViewInit(): void {
    this.initMap();
    this.onMapReady();
  }

  onSelectActeur(value) {
    this.selectedActeur = value;
  }
  roundNumber(x) {
    return parseInt(x).toFixed(2);
  }
  initMap() {
    this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 53.5rem;postion: fixed;bottom:0;'></div>";
    var osmUrl = this.selectedCouche,
      osmLayer = new L.TileLayer(osmUrl, {
        attribution: 'PATRIMOINE SIM-MAP',
        detectRetina: false,
        maxNativeZoom: 19,
        maxZoom: 19,
        minZoom: 12,
        noWrap: false,
        opacity: 1,
        subdomains: 'abc',
        tms: false,
      });
    this.map = new L.Map('map');
    this.map.setView(new L.LatLng(this.datas.sims[0].properties.longitude, this.datas.sims[0].properties.latitude), 12);
    this.map.addLayer(osmLayer);
  }
  onMapReady() {
    console.log("datasdatasdatasdatasdatasdatas", this.datas);

    var AcitifIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_vert.svg',
      iconSize: [10, 10],
    });
    var InactifIcon = L.icon({
      iconUrl: '../../../../../assets/images/map/geojson-inactif.png',
      iconSize: [10, 10],
    });

    const simActive = this.datas.sims.filter(function (data) {
      return data.properties?.statut === 'actif'
    });

    const simInactive = this.datas.sims.filter(function (data) {
      return data.properties?.statut === 'inactif'
    });


    // const ActifControl = L.geoJSON(simActive, {
    //   pointToLayer: function (feature, latlng) {
    //     return L.marker(latlng, { icon: AcitifIcon });
    //   }
    // }).addTo(this.map)

    // const InactifControl = L.geoJSON(simInactive, {
    //   pointToLayer: function (feature, latlng) {
    //     return L.marker(latlng, { icon: InactifIcon });
    //   }
    // }).addTo(this.map)

    const geoJsonMarkerActfOptions = {
      radius: 8,
      fillColor: "#3498db",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }
    const geoJsonMarkerInactfOptions = {
      radius: 8,
      fillColor: "#DF0101",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }

    const makerClusterActif = L.markerClusterGroup().addTo(this.map);
    const makerClusterInactif = L.markerClusterGroup().addTo(this.map);

    // Initialisation des geojson
    L.geoJSON(this.datas.limite_exploitations).addTo(this.map);

    const ActifControl = L.geoJSON(simActive, {
      pointToLayer: function (feature, latlng) {
        return makerClusterActif.addLayer(L.circleMarker(latlng, geoJsonMarkerActfOptions));
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<div class='bind_popup_class'>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature.properties.msisdn + "</span>" + "<br>" +
          "<strong>Adresse IP:</strong>" + "<span>" + feature.properties.adresse_ip + "</span>" + "<br>" +
          "<strong>Etat :</strong>" + "<span>" + feature.properties.etat + "</span>" + "<br>" +
          "</div>"
        );
      },
    }).addTo(this.map)

    const InactifControl = L.geoJSON(simInactive, {
      pointToLayer: function (feature, latlng) {
        return makerClusterInactif.addLayer(L.circleMarker(latlng, geoJsonMarkerInactfOptions));
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<div classs='bind_popup_class'>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature.properties.msisdn + "</span>" + "<br>" +
          "<strong>Adresse IP:</strong>" + "<span>" + feature.properties.adresse_ip + "</span>" + "<br>" +
          "<strong>Etat :</strong>" + "<span>" + feature.properties.etat + "</span>" + "<br>" +
          "</div>"
        );
      },
    }).addTo(this.map)

    var baseMaps = {
      'OpenStreetMap': this.OpenStreetMap,
      'Satellite': this.satelite
    }
    var StateMarker = {
      "<span style='font-weight:bold'>Actif</span><span><img src='assets/images/map/geojson-actif.png' style='width: 10px;height: 10px;margin-left: 20px'/></span>": ActifControl,
      "<span style='font-weight:bold'>Inactif</span><span><img src='assets/images/map/geojson-inactif.png' style='width: 10px;height: 10px;margin-left: 20px'/></span>": InactifControl,
    }
    L.control.layers(baseMaps, StateMarker, { collapsed: false }).addTo(this.map);
  }
  showModalSideBar() {
    this.sidebarShow = true;
  }

}
