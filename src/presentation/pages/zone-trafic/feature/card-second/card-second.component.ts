import { TypeAlarme } from './../../../../../shared/enum/TypeAlarme.enum';
import { map } from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { NgbAccordionConfig, } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Router } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { style } from '@angular/animations';
import { PusherWebsocketService } from 'src/shared/services/pusher-websocket.service';

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

  GeoJsonNormale: any;
  GeoJsonMineure: any;
  GeoJsonMajeure: any;
  GeoJsonCritique: any;

  markerAlarmeNormal = [];
  markerAlarmeMineure = [];
  markerAlarmeMajeure = [];
  markerAlarmeCritique = [];

  traficLayer: any;
  listEvents = [];
  lastTraficEvent: any;

  constructor(
    config: NgbAccordionConfig,
    private router: Router,
    private mappingService: MappingService,
    private pusherWebsocketService: PusherWebsocketService


  ) {
    this.activatedRoute = this.router.url;
    config.closeOthers = true;

    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;

    //setTimeout(() => {
    // console.log("listEvents", this.listEvents);
    // alert("dattattata")
    // },1000);
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
    this.map.setView(new L.LatLng(this.datas.site_geo.features[0]?.properties.LONGITUDE, this.datas.site_geo.features[0]?.properties.LATITUDE), 16);
    //this.map.setView(new L.LatLng(5.541138, -3.96872), 16);

    this.map.addLayer(osmLayer);
  }

  //-3.96872 ; 5.541138

  onMapReady() {

    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON SITE@@@@@@@@@@@@@@@@@

    console.log("datas", this.datas);
    this.traficLayer = this.datas.trafic
    const geoJsonSite = L.geoJSON(this.datas.site_geo, {
      style: function () {
        return {
          weight: 2,
          opacity: 1,
          color: '#FAAC58',
          fillOpacity: 0.1
        }
      },
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(feature.properties.SITE, { permanent: true, direction: 'bottom', className: 'leaflet-tooltip-site' });
      }
    }).addTo(this.map);

    // this.map.on('zoomend',
    //   function () {
    //     if (this.map.hasLayer(geoJsonSite)) {
    //       geoJsonSite.eachLayer(function (layer) {
    //         if (this.map.getZoom()) {
    //           //console.log('remove tooltip');
    //           this.map.removeLayer(geoJsonSite);
    //           layer.unbindTooltip();

    //         }
    //       });
    //     }

    //   }
    // );

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
        layer.bindTooltip(feature.properties.RESSORT, { permanent: true, direction: 'center', className: 'leaflet-tooltip-ressort' });
      },
    }).addTo(this.map)


    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON TRAFIC@@@@@@@@@@@@@@@@@


    // var AlarmeNormale = {
    //   radius: 8,
    //   fillColor: "#04B431",
    //   color: "#000",
    //   weight: 1,
    //   opacity: 1,
    //   fillOpacity: 0.8
    // };
    // var AlarmeMineur = {
    //   radius: 8,
    //   fillColor: "#FFFF00",
    //   color: "#000",
    //   weight: 1,
    //   opacity: 1,
    //   fillOpacity: 0.8
    // };
    // var AlarmeMajeur = {
    //   radius: 8,
    //   fillColor: "#FFBF00",
    //   color: "#000",
    //   weight: 1,
    //   opacity: 1,
    //   fillOpacity: 0.8
    // };
    // var AlarmeCritique = {
    //   radius: 8,
    //   fillColor: "#DF0101",
    //   color: "#000",
    //   weight: 1,
    //   opacity: 1,
    //   fillOpacity: 0.8
    // };

    const geojsonTrafic = L.geoJSON(this.traficLayer, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_vert.svg',
            iconSize: [50, 50],
          })
        });
        // if (feature?.properties?.alarme_critique === 0) {
        //   markerAlarmeNormal.push(feature);
        // } else if (feature?.properties?.alarme_critique === 1) {
        //   markerAlarmeMineure.push(feature);
        //   //return L.circleMarker(latlng, AlarmeMineur);
        // } else if (feature?.properties?.alarme_critique === 2) {
        //   markerAlarmeMajeure.push(feature);
        //   //return L.circleMarker(latlng, AlarmeMajeur);
        // } else if (feature?.properties.alarme_critique === 3) {
        //   markerAlarmeCritique.push(feature);
        //   return null
        // }
      }
    }).addTo(this.map);
    this.pusherWebsocketService.channel.bind("event-zone-1595", (data) => {
      this.listEvents.push(data);
      this.lastTraficEvent = this.listEvents[this.listEvents.length - 1];
      console.log("lastTraficEvent", this.lastTraficEvent);
      if (this.listEvents.length !== 0) {
        this.map.removeLayer(geojsonTrafic);
        L.geoJSON(this.lastTraficEvent?.data?.trafic, {
          pointToLayer: function (feature, latlng) {
            if (feature?.properties?.Alarme === TypeAlarme.NORMAL) {
              this.markerAlarmeNormal.push(feature);
            } else if (feature?.properties?.Alarme === TypeAlarme.MINEUR) {
              this.markerAlarmeMineure.push(feature);
            } else if (feature?.properties?.Alarme === TypeAlarme.MAJEUR) {
              this.markerAlarmeMajeure.push(feature);
            } else if (feature?.properties.Alarme === TypeAlarme.CRITIQUE) {
              this.markerAlarmeCritique.push(feature);
              return null
            }
          }
        })
      }
    });

    //Alarme Normal
    this.GeoJsonNormale = L.geoJSON(this.markerAlarmeNormal, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_vert.svg',
            iconSize: [50, 50],
          })
        });
      },
    }).addTo(this.map)

    //Alarme Mineure
    this.GeoJsonMineure = L.geoJSON(this.markerAlarmeMineure, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_jaune.svg',
            iconSize: [50, 50],
          })
        });
      },
    }).addTo(this.map);

    //Alarme Majeure
    this.GeoJsonMajeure = L.geoJSON(this.markerAlarmeMajeure, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
            iconSize: [50, 50],
          })
        });
      },
    }).addTo(this.map);
    //Alarme Critique
    this.GeoJsonCritique = L.geoJSON(this.markerAlarmeCritique, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_rouge.svg',
            iconSize: [50, 50],
          })
        });
      },
    }).addTo(this.map);

    var baseMaps = {
      'OpenStreetMap': this.OpenStreetMap,
      'Satellite': this.satelite
    }
    var layerGeoJson = {
      "<span style='font-weight:bold'>SITE - OCI</span>": geoJsonSite,
      "<span style='font-weight:bold'>EMPLACEMENT</span>": geoJsonSim,
      "<span style='font-weight:bold'>RESSORT</span>": geojsonRessort,
      //"<span style='font-weight:bold' class='trafic-sim'>SIM ALARME</span>": geoJsonTrafic,
      "<span style='font-weight:bold;' ><b>Alarme Normale</b></span><span><img src='assets/svg/sim_loc_vert.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": this.GeoJsonNormale,
      "<span style='font-weight:bold;' ><b>Alarme Mineure</b></span><span><img src='assets/svg/sim_loc_jaune.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": this.GeoJsonMineure,
      "<span style='font-weight:bold;' ><b>Alarme Majeure</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": this.GeoJsonMajeure,
      "<span style='font-weight:bold;' ><b>Alarme Critique</b></span><span><img src='assets/svg/sim_loc_rouge.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": this.GeoJsonCritique
    }

    L.control.layers(baseMaps, layerGeoJson, {
      collapsed: false,
    }).addTo(this.map);
    //L.control.scale().addTo(this.map);

  }
  showModalSideBar() {
    this.sidebarShow = true;
  }

}
