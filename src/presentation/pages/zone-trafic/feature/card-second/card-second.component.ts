import { map } from 'rxjs/operators';
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
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-card-second',
  templateUrl: './card-second.component.html',
  styleUrls: ['./card-second.component.scss']
})
export class CardSecondComponent implements AfterViewInit {
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
  map: any;
  OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'ZONE DE TRAFIC',
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
    attribution: 'ZONE DE TRAFIC',
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
  selectedCart: string = 'firstCart';
  public checkboxStates: any;
  public selectedCouche: any = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  @ViewChild('parcelleMap') parcelleMap: ElementRef;
  @Input() maxi: boolean;
  selectedMaximized: any;
  dataReady: any;
  selectedStates: string[] = [];
  //Mapping
  firstLevelLibelle: string;
  secondLevelLibelle: string;
  thirdLevelLibelle: string;
  constructor(
    config: NgbAccordionConfig,
    private router: Router,
    private mappingService: MappingService,

  ) {
    this.activatedRoute = this.router.url;
    config.closeOthers = true;

    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
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
    //console.log("this.datas.site_geo.features[0].properties.LONGITUDE", this.datas.site_geo.features[0].properties.LONGITUDE);
    this.map.setView(new L.LatLng(this.datas.site_geo.features[0].properties.LONGITUDE, this.datas.site_geo.features[0].properties.LATITUDE), 14);
    this.map.addLayer(osmLayer);
  }
  onMapReady() {

    this.OpenStreetMap.addTo(this.map);

    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON SITE@@@@@@@@@@@@@@@@@

    const geoJsonSite = L.geoJSON(this.datas.site_geo, {
      style: function () {
        return {
          weight: 2,
          opacity: 1,
          color: 'black',
          fillOpacity: 0
        }
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          '<span>' + feature.properties?.SITE + '</span>'
        ).openPopup();
      }
    }).addTo(this.map);


    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON SIM@@@@@@@@@@@@@@@@@@@@@
    var AcitifIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
      iconSize: [50, 50],
    });
    const geoJsonSim = L.geoJSON(this.datas.sim, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: AcitifIcon });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature.properties?.msisdn + "</span>" + "<br>" +
          "<strong>" + this.firstLevelLibelle + ":</strong>" + "<span>" + feature.properties?.Niveau_1 + "</span>" + "<br>" +
          "<strong>" + this.secondLevelLibelle + ":</strong>" + "<span>" + feature.properties?.Niveau_2 + "</span>" + "<br>" +
          "<strong>Statut:</strong>" + "<span>" + feature.properties?.Statut + "</span>" + "<br>" +
          "</div>",
        ).openPopup();
      }
    }).addTo(this.map)

    //@@@@@@@@@@@@@@@@@@@GEOJSON RESSORT@@@@@@@@@@@@@@@@@@
    const geojsonRessort = L.geoJSON(this.datas.ressort, {
      style: function () {
        return { fill: true, fillOpacity: 0 };
      },
      onEachFeature: function (feature, layer) {
        layer.on({
          mouseover: function () {
            this.setStyle({
              'fillColor': '#b45501',
            });
          },
          mouseout: function () {
            this.setStyle({
              'fillColor': '#f0d1b1',
            });
          },
        });
        layer.bindTooltip(feature.properties.RESSORT, { permanent: true, direction: 'center', className: 'labelLimit' });
      },
    }).addTo(this.map)


    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON TRAFIC@@@@@@@@@@@@@@@@@


    var AlarmeNormale = {
      radius: 8,
      fillColor: "#04B431",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    var AlarmeMineur = {
      radius: 8,
      fillColor: "#FFFF00",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    var AlarmeMajeur = {
      radius: 8,
      fillColor: "#FFBF00",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    var AlarmeCritique = {
      radius: 8,
      fillColor: "#DF0101",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    };
    const geoJsonTrafic = L.geoJSON(this.datas.trafic, {
      pointToLayer: function (feature, latlng) {
        if (feature.properties.Alarme === "0") {
          return L.circleMarker(latlng, AlarmeNormale);
        } else if (feature.properties.Alarme === "1") {
          return L.circleMarker(latlng, AlarmeMineur);
        } else if (feature.properties.Alarme === "2") {
          return L.circleMarker(latlng, AlarmeMajeur);
        } else if (feature.properties.Alarme === "3") {
          return L.circleMarker(latlng, AlarmeCritique);
        }
      }
    }).addTo(this.map);


    var baseMaps = {
      'OpenStreetMap': this.OpenStreetMap,
      'Satellite': this.satelite
    }
    var layerGeoJson = {
      "<span style='font-weight:bold'>SITE - OCI</span>": geoJsonSite,
      "<span style='font-weight:bold'>SIM GEO</span>": geoJsonSim,
      "<span style='font-weight:bold'>RESSORT</span>": geojsonRessort,
      "<span style='font-weight:bold'>SIM ALARME</span>": geoJsonTrafic,
    }
    L.control.layers(baseMaps, layerGeoJson, {
      collapsed: false,

    }).addTo(this.map);
  }
  showModalSideBar() {
    this.sidebarShow = true;
  }

}
