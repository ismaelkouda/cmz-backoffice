import { TypeAlarme } from './../../../../../shared/enum/TypeAlarme.enum';
import {
  AfterViewInit,
  Component,
  Input,
  ViewChild,
  ElementRef,
  OnDestroy
} from '@angular/core';
import { NgbAccordionConfig, } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Router } from '@angular/router';
import { MappingService } from 'src/shared/services/mapping.service';
import { PusherWebsocketService } from 'src/shared/services/pusher-websocket.service';
import { ZoneTraficService } from '../../data-access/zone-trafic.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-second',
  templateUrl: './card-second.component.html',
  styleUrls: ['./card-second.component.scss']
})
export class CardSecondComponent implements AfterViewInit,OnDestroy {
  @Input() datas;
  @Input() trackingLayer;
  @Input() display: boolean
  @ViewChild('parcelleMap') parcelleMap: ElementRef;
  @Input() maxi: boolean;
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
  layerParcelleRessort: any;
  layer: any;
  showLayer: boolean = false;
  extended: boolean = false;
  selectedCart: string = 'firstCart';
  public checkboxStates: any;
  selectedMaximized: any;
  dataReady: any;
  selectedStates: string[] = [];
  //Mapping
  public firstLevelLibelle: string;
  public secondLevelLibelle: string;
  public thirdLevelLibelle: string;
   GeoJsonNormale: any;
  public GeoJsonMineure: any;
  public GeoJsonMajeure: any;
  public GeoJsonCritique: any;
  public markerAlarmeNormal: any = [];
  public markerAlarmeMineure: any = [];
  public markerAlarmeMajeure: any = [];
  public markerAlarmeCritique: any = [];
  traficLayer: any;
  listEvents = [];
  lastTraficEvent: any;
  currentTraficLayer: any
  public handleIntervalle: any;

  constructor(
    config: NgbAccordionConfig,
    private router: Router,
    private mappingService: MappingService,
    //private pusherWebsocketService: PusherWebsocketService
    private zoneTraficService: ZoneTraficService,
    private toastrService: ToastrService,
  ) {
    this.activatedRoute = this.router.url;
    config.closeOthers = true;
  }

  /**
   * @author André ATCHORI
   */

   ngAfterViewInit(): void {
    this.initMap();
    this.onMapReady();
  }

  initMap() {
    this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 53.5rem;postion: fixed;bottom:0;'></div>";
     var osmLayer = this.OpenStreetMap
    this.map = new L.Map('map');
    this.map.setView(new L.LatLng(this.datas.site_geo.features[0]?.properties.LONGITUDE, this.datas.site_geo.features[0]?.properties.LATITUDE), 16);
    this.map.addLayer(osmLayer);
  }
  onMapReady() {

    const firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    const secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    const thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;

    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON SITE@@@@@@@@@@@@@@@@@
    
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
    //         console.log('remove tooltip');
    //           this.map.removeLayer(geoJsonSite);
    //           layer.unbindTooltip();

    //         }
    //       });
    //     }

    //   }
    // );

    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON SIM@@@@@@@@@@@@@@@@@@@@@
    
    const geoJsonSim = L.geoJSON(this.datas.sim, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon:  L.icon({
          iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
          iconSize: [50, 50],
        })});
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature.properties?.msisdn + "</span>" + "<br>" +
          "<strong>" + firstLevelLibelle + ":</strong>" + "<span>" + feature.properties?.Niveau_1 + "</span>" + "<br>" +
          "<strong>" + secondLevelLibelle + ":</strong>" + "<span>" + feature.properties?.Niveau_2 + "</span>" + "<br>" +
          "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature.properties?.zone?.nom + "</span>" + "<br>" +
          "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + feature.properties?.nom_prenoms + "</span>" + "<br>" +
          "</div>",
        ).openPopup();
      }
    }).addTo(this.map)

    let GeoJsonNormal

   this.handleIntervalle = setInterval(() => {
      this.GetPositionSimTracking(this.markerAlarmeNormal,this.markerAlarmeMineure,this.markerAlarmeMajeure,this.markerAlarmeCritique)
      //Normale
       GeoJsonNormal = L.geoJSON(this.markerAlarmeNormal, {
        pointToLayer: function (feature, latlng) {          
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: '../../../../../assets/svg/sim_loc_vert.svg',
              iconSize: [50, 50],
            })
          }).bindPopup(
            "<div>" + "" +
            "<strong>Numero SIM :</strong>" + "<span>" + feature.properties.msisdn + "</span>" + "<br>" +
            "<strong>" + firstLevelLibelle + " :</strong>" + "<span>" + feature.properties?.direction_regionale?.nom + "</span>" + "<br>" +
            "<strong>" + secondLevelLibelle + " :</strong>" + "<span>" + feature.properties?.exploitation?.nom + "</span>" + "<br>" +
            "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature.properties?.zone?.nom + "</span>" + "<br>" +
            "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + feature.properties?.nom_prenoms + "</span>" + "<br>" +
            "</div>",
          ).openPopup();
        },
      }).addTo(this.map)

      // Alarme Mineure
      L.geoJSON(this.markerAlarmeMineure, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: '../../../../../assets/svg/sim_loc_jaune.svg',
              iconSize: [50, 50],
            })
          }).bindPopup(
            "<div>" + "" +
            "<strong>Numero SIM :</strong>" + "<span>" + feature.properties.msisdn + "</span>" + "<br>" +
            "<strong>" + firstLevelLibelle + " :</strong>" + "<span>" + feature.properties?.direction_regionale?.nom + "</span>" + "<br>" +
            "<strong>" + secondLevelLibelle + " :</strong>" + "<span>" + feature.properties?.exploitation?.nom + "</span>" + "<br>" +
            "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature.properties?.zone?.nom + "</span>" + "<br>" +
            "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + feature.properties?.nom_prenoms + "</span>" + "<br>" +
            "</div>",
          ).openPopup();;
        },
      }).addTo(this.map);

      //Alarme Majeure
        L.geoJSON(this.markerAlarmeMajeure, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: L.icon({
                iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
                iconSize: [50, 50],
              })
            }).bindPopup(
              "<div>" + "" +
              "<strong>Numero SIM :</strong>" + "<span>" + feature.properties.msisdn + "</span>" + "<br>" +
              "<strong>" + firstLevelLibelle + " :</strong>" + "<span>" + feature.properties?.direction_regionale?.nom + "</span>" + "<br>" +
              "<strong>" + secondLevelLibelle + " :</strong>" + "<span>" + feature.properties?.exploitation?.nom + "</span>" + "<br>" +
              "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature.properties?.zone?.nom + "</span>" + "<br>" +
              "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + feature.properties?.nom_prenoms + "</span>" + "<br>" +
              "</div>",
            ).openPopup();;
          },
      }).addTo(this.map);
     //Alarme Critique
     L.geoJSON(this.markerAlarmeCritique, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_rouge.svg',
            iconSize: [50, 50],
          })
        }).bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature.properties.msisdn + "</span>" + "<br>" +
          "<strong>" + firstLevelLibelle + " :</strong>" + "<span>" + feature.properties?.direction_regionale?.nom + "</span>" + "<br>" +
          "<strong>" + secondLevelLibelle + " :</strong>" + "<span>" + feature.properties?.exploitation?.nom + "</span>" + "<br>" +
          "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature.properties?.zone?.nom + "</span>" + "<br>" +
          "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + feature.properties?.nom_prenoms + "</span>" + "<br>" +
          "</div>",
        ).openPopup();;
      },
      }).addTo(this.map);
    }, 5000);


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

    // const geojsonTrafic = L.geoJSON(this.currentTraficLayer, {
    //   pointToLayer: function (feature, latlng) {        
    //     if (feature?.properties?.Alarme === TypeAlarme.NORMAL) {
    //       this.markerAlarmeNormal.push(feature);
    //     } else if (feature?.properties?.Alarme === TypeAlarme.MINEUR) {
    //       this.markerAlarmeMineure.push(feature);
    //     } else if (feature?.properties?.Alarme === TypeAlarme.MAJEUR) {
    //       this.markerAlarmeMajeure.push(feature);
    //     } else if (feature?.properties.Alarme === TypeAlarme.CRITIQUE) {
    //       this.markerAlarmeCritique.push(feature);
    //       return null
    //     }
    //   }
    // }).addTo(this.map);
    // this.pusherWebsocketService.channel.bind("event-zone-1559", (data) => {
    //   console.log("list-data");
    //   this.listEvents.push(data);
    //   console.log("list",this.listEvents);
    //   this.lastTraficEvent = this.listEvents[this.listEvents.length - 1];
    //   console.log("lastTraficEvent", this.lastTraficEvent);
    //   if (this.listEvents.length !== 0) {
    //     this.map.removeLayer(geojsonTrafic);
    //     L.geoJSON(this.lastTraficEvent?.data?.trafic, {
    //       pointToLayer: function (feature, latlng) {
    //         if (feature?.properties?.Alarme === TypeAlarme.NORMAL) {
    //           this.markerAlarmeNormal.push(feature);
    //         } else if (feature?.properties?.Alarme === TypeAlarme.MINEUR) {
    //           this.markerAlarmeMineure.push(feature);
    //         } else if (feature?.properties?.Alarme === TypeAlarme.MAJEUR) {
    //           this.markerAlarmeMajeure.push(feature);
    //         } else if (feature?.properties.Alarme === TypeAlarme.CRITIQUE) {
    //           this.markerAlarmeCritique.push(feature);
    //           return null
    //         }
    //       }
    //     })
    //   }
    // });

    var baseMaps = {
      'OpenStreetMap': this.OpenStreetMap.addTo(this.map),
      'Satellite': this.satelite
    }
    var layerGeoJson = {
      "<span style='font-weight:bold'>SITE - OCI</span>": geoJsonSite,
      "<span style='font-weight:bold'>EMPLACEMENT</span>": geoJsonSim,
      "<span style='font-weight:bold'>RESSORT</span>": geojsonRessort,
      // "<span style='font-weight:bold;' ><b>Alarme Normale</b></span><span><img src='assets/svg/sim_loc_vert.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": null,
      // "<span style='font-weight:bold;' ><b>Alarme Mineure</b></span><span><img src='assets/svg/sim_loc_jaune.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": null,
      // "<span style='font-weight:bold;' ><b>Alarme Majeure</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": null,
      // "<span style='font-weight:bold;' ><b>Alarme Critique</b></span><span><img src='assets/svg/sim_loc_rouge.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": null
    }

    L.control.layers(baseMaps, layerGeoJson, {
      collapsed: false,
    }).addTo(this.map);
    //L.control.scale().addTo(this.map);

  }
   GetPositionSimTracking(normalLayer: any = [],mineurLayer: any = [],majeurLayer: any = [],critiqueLayer: any = []) {
    this.zoneTraficService
      .GetPositionSimTracking(656).subscribe({
        next: (response) => {
          this.currentTraficLayer = response['data']['trafic']; 
          // this.map.removeLayer(lastLayer)
          // this.map.removeLayer(normalLayer)
          // this.map.removeLayer(mineurLayer)
          // this.map.removeLayer(majeurLayer)
          // this.map.removeLayer(critiqueLayer)
          normalLayer.splice(0,normalLayer.length);
          mineurLayer.splice(0,mineurLayer.length);
          majeurLayer.splice(0,majeurLayer.length);
          critiqueLayer.splice(0,critiqueLayer.length);  
          L.geoJSON(this.currentTraficLayer, {
            pointToLayer: function (feature, latlng) {
              if (feature?.properties?.Alarme === TypeAlarme.NORMAL) {
                normalLayer.push(feature)                                
              } else if (feature?.properties?.Alarme === TypeAlarme.MINEUR) {
                mineurLayer.push(feature)                                
              } else if (feature?.properties?.Alarme === TypeAlarme.MAJEUR) {
                majeurLayer.push(feature)                                
              } else if (feature?.properties.Alarme === TypeAlarme.CRITIQUE) {
                critiqueLayer.push(feature)                                
                return null
              }
            }
          }).addTo(this.map);
        },
        error: (error) => {
          this.toastrService.error(error.error.message);
        }
      })
  }

  ngOnDestroy(): void {
      clearInterval(this.handleIntervalle)
  }


}
