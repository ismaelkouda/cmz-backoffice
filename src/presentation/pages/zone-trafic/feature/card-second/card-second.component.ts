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
  @Input() zoneId;
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
    attribution: 'SIM MONITORING-MAP',
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
    attribution: 'SIM MONITORING-MAP',
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
  traficLayer: any;
  listEvents = [];
  lastTraficEvent: any;
  currentTraficLayer: any
  public handleIntervalle: any;


   isNormalLayer: boolean = true;
   isMineureLayer: boolean = true;
   isMajeureLayer: boolean = true;
   isCritiqueLayer: boolean = true;

  constructor(
    config: NgbAccordionConfig,
    private router: Router,
    private mappingService: MappingService,
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

    var myLayerGroup = L.layerGroup().addTo(this.map);

    var normalLayerGroup = L.layerGroup();
    var mineurLayerGroup = L.layerGroup();
    var majeurLayerGroup = L.layerGroup();
    var critiqueLayerGroup = L.layerGroup();

    //@@@@@@@@@@@@@@@@@@@@@@GEOJSON SITE@@@@@@@@@@@@@@@@@

    var customIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_vert.svg',
      iconSize: [50, 50],
      iconAnchor: [17, 17],
    });
    const geoJsonSite = L.geoJSON(this.datas.site_geo, {
      style: function () {
        return {
          weight: 2,
          opacity: 1,
          color: '#FAAC58',
          fillOpacity: 0.1
        };
      },
      pointToLayer: function (feature) {
        return L.marker([feature?.properties?.LONGITUDE, feature?.properties?.LATITUDE])
          .setIcon(customIcon);
      },
      onEachFeature: function (feature, layer) {
        layer.bindTooltip(feature.properties.NAME, { permanent: true, direction: 'bottom', className: 'leaflet-tooltip-other-points' });
      }
    });
    geoJsonSite.addTo(this.map); 
    
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
          "<strong>Numero SIM :</strong>" + "<span>" + feature?.properties?.msisdn + "</span>" + "<br>" +
          "<strong>" + firstLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.niveau_un?.nom + "</span>" + "<br>" +
          "<strong>" + secondLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.niveau_deux?.nom + "</span>" + "<br>" +
          "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature?.properties?.niveau_trois?.nom + "</span>" + "<br>" +
          "<strong>" + "Statut :" + "</strong>" + "<span>" + feature?.properties?.statut + "</span>" + "<br>" +
          "<strong>" + "Point Emplacement :" + "</strong>" + "<span>" + feature?.properties?.point_emplacement + "</span>" + "<br>" +
          "<strong>" + "Site :" + "</strong>" + "<span>" + feature?.properties?.site + "</span>" + "<br>" +
          "<strong>" + "Coordonnées GPS :" + "</strong>" + "<span>" +feature?.properties?.longitude+ ", "+ feature?.properties?.latitude+"</span>" + "<br>" +
          "<strong>" + "Solde Data (Go) :" + "</strong>" + "<span>" + (Number(feature?.properties?.solde_actuel_go) || 0).toFixed(2) + "</span>"+ "<br>"+
          "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + feature?.properties?.date_id + "</span>"+
          "</div>",
        ).openPopup();
      }
    })

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
    })

   var normalLayer;
   var mineurLayer;
   var majeurLayer;
   var critiqueLayer;
   var markerAlarmeNormal = []
   var markerAlarmeMineure = []
   var markerAlarmeMajeure = []
   var markerAlarmeCritique = []

   var layerControl = null;

   myLayerGroup.addLayer(geoJsonSim)
   myLayerGroup.addLayer(geoJsonSite)
   myLayerGroup.addLayer(geojsonRessort)
    
   this.handleIntervalle = setInterval(() => {
    this.GetPositionSimTracking(markerAlarmeNormal, markerAlarmeMineure,markerAlarmeMajeure,markerAlarmeCritique);  
    
    // Alarme Normal
    normalLayer =  L.geoJSON(markerAlarmeNormal, {
      pointToLayer: function (feature, latlng) {    
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_vert.svg',
            iconSize: [50, 50],
          })
        }).bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature?.properties?.msisdn + "</span>" + "<br>" +
          "<strong>" + firstLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_un?.nom + "</span>" + "<br>" +
          "<strong>" + secondLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_deux?.nom + "</span>" + "<br>" +
          "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature?.properties?.sim?.niveau_trois?.nom + "</span>" + "<br>" +
          "<strong>" + "Statut :" + "</strong>" + "<span>" + feature?.properties?.sim?.statut + "</span>" + "<br>" +
          "<strong>" + "Point Emplacement :" + "</strong>" + "<span>" + feature?.properties?.sim?.point_emplacement + "</span>" + "<br>" +
          "<strong>" + "Site :" + "</strong>" + "<span>" + feature?.properties?.site + "</span>" + "<br>" +
          "<strong>" + "Coordonnées GPS :" + "</strong>" + "<span>" +feature?.properties?.long_site+ ", "+ feature?.properties?.lat_site+"</span>" + "<br>" +
          "<strong>" + "Solde Data (Go) :" + "</strong>" + "<span style='color: #FFFFFF;font-weight: bold;background-color: #27ae60; padding: 2px 10px; border-radius: 2px'>" + (Number(feature?.properties?.solde_actuel_go) || 0).toFixed(2) + "</span>"+ "<br>"+
          "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + feature?.properties?.date_id + "</span>"+
          "</div>",
        ).openPopup();
      },
    })
      
    //Alarme Mineure
      mineurLayer = L.geoJSON(markerAlarmeMineure, {
        pointToLayer: function (feature, latlng) {
          return L.marker(latlng, {
            icon: L.icon({
              iconUrl: '../../../../../assets/svg/sim_loc_jaune.svg',
              iconSize: [50, 50],
            })
          }).bindPopup(
            "<div>" + "" +
            "<strong>Numero SIM :</strong>" + "<span>" + feature?.properties?.msisdn + "</span>" + "<br>" +
            "<strong>" + firstLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_un?.nom + "</span>" + "<br>" +
            "<strong>" + secondLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_deux?.nom + "</span>" + "<br>" +
            "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature?.properties?.sim?.niveau_trois?.nom + "</span>" + "<br>" +
            "<strong>" + "Statut :" + "</strong>" + "<span>" + feature?.properties?.sim?.statut + "</span>" + "<br>" +
            "<strong>" + "Point Emplacement :" + "</strong>" + "<span>" + feature?.properties?.sim?.point_emplacement + "</span>" + "<br>" +
            "<strong>" + "Site :" + "</strong>" + "<span>" + feature?.properties?.site + "</span>" + "<br>" +
            "<strong>" + "Coordonnées GPS :" + "</strong>" + "<span>" +feature?.properties?.long_site+ ", "+ feature?.properties?.lat_site+"</span>" + "<br>" +
            "<strong>" + "Solde Data (Go) :" + "</strong>" + "<span style='color: #000000;font-weight: bold;background-color: #FFFF00; padding: 2px 10px; border-radius: 2px'>" + (Number(feature?.properties?.solde_actuel_go) || 0).toFixed(2) + "</span>"+"<br>"+
            "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + feature?.properties?.date_id + "</span>"+
            "</div>",
          ).openPopup();
        },
      });

    //Alarme Majeure
       majeurLayer =  L.geoJSON(markerAlarmeMajeure, {
          pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
              icon: L.icon({
                iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
                iconSize: [50, 50],
              })
            }).bindPopup(
              "<div>" + "" +
              "<strong>Numero SIM :</strong>" + "<span>" + feature?.properties?.msisdn + "</span>" + "<br>" +
              "<strong>" + firstLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_un?.nom + "</span>" + "<br>" +
              "<strong>" + secondLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_deux?.nom + "</span>" + "<br>" +
              "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature?.properties?.sim?.niveau_trois?.nom + "</span>" + "<br>" +
              "<strong>" + "Statut :" + "</strong>" + "<span>" + feature?.properties?.sim?.statut + "</span>" + "<br>" +
              "<strong>" + "Point Emplacement :" + "</strong>" + "<span>" + feature?.properties?.sim?.point_emplacement + "</span>" + "<br>" +
              "<strong>" + "Site :" + "</strong>" + "<span>" + feature?.properties?.site + "</span>" + "<br>" +
              "<strong>" + "Coordonnées GPS :" + "</strong>" + "<span>" +feature?.properties?.long_site+ ", "+ feature?.properties?.lat_site+"</span>" + "<br>" +
              "<strong>" + "Solde Data (Go) :" + "</strong>" + "<span style='color: #FFFFFF;font-weight: bold;background-color: #FE9A2E; padding: 2px 10px; border-radius: 2px'>" + (Number(feature?.properties?.solde_actuel_go) || 0).toFixed(2) + "</span>"+"<br>"+
              "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + feature?.properties?.date_id + "</span>"+
              "</div>",
            ).openPopup();
          },
      });
      
     //Alarme Critique
     critiqueLayer = L.geoJSON(markerAlarmeCritique, {
      pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
          icon: L.icon({
            iconUrl: '../../../../../assets/svg/sim_loc_rouge.svg',
            iconSize: [50, 50],
          })
        }).bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + feature?.properties?.msisdn + "</span>" + "<br>" +
          "<strong>" + firstLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_un?.nom + "</span>" + "<br>" +
          "<strong>" + secondLevelLibelle + ":</strong>" + "<span>" + feature?.properties?.sim?.niveau_deux?.nom + "</span>" + "<br>" +
          "<strong>" + thirdLevelLibelle + " :</strong>" + "<span>" + feature?.properties?.sim?.niveau_trois?.nom + "</span>" + "<br>" +
          "<strong>" + "Statut :" + "</strong>" + "<span>" + feature?.properties?.sim?.statut + "</span>" + "<br>" +
          "<strong>" + "Point Emplacement :" + "</strong>" + "<span>" + feature?.properties?.sim?.point_emplacement + "</span>" + "<br>" +
          "<strong>" + "Site :" + "</strong>" + "<span>" + feature?.properties?.site + "</span>" + "<br>" +
          "<strong>" + "Coordonnées GPS :" + "</strong>" + "<span>" +feature?.properties?.long_site+ ", "+ feature?.properties?.lat_site+"</span>" + "<br>" +
          "<strong>" + "Solde Data (Go) :" + "</strong>" + "<span style='color: #FFFFFF;font-weight: bold;background-color: #e74c3c; padding: 2px 10px; border-radius: 2px'>" + (Number(feature?.properties?.solde_actuel_go) || 0).toFixed(2) + "</span>"+"<br>"+
          "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + feature?.properties?.date_id + "</span>"+
          "</div>",
        ).openPopup();;
      },
      });

     const normalControl = normalLayerGroup.addLayer(normalLayer);
     const mineureControl = mineurLayerGroup.addLayer(mineurLayer);
     const majeureControl = majeurLayerGroup.addLayer(majeurLayer);
     const critiqueControl = critiqueLayerGroup.addLayer(critiqueLayer);


    }, 5000);    
    
    var baseMaps = {
      'OpenStreetMap': this.OpenStreetMap.addTo(this.map),
      'Satellite': this.satelite
    }
    
    var layerGeoJson = {
       "<span style='font-weight:bold;' ><b>SITES - OCI</b></span><span><img src='assets/svg/oci_site.svg' style='width: 12px; margin-left: 20px;'/></span>": geoJsonSite,
       "<span style='font-weight:bold'><b>EMPLACEMENTS</b></span><span><img src='assets/svg/sim_loc_noir.svg' style='width: 10px; margin-left: 20px;'/></span>": geoJsonSim,
       "<span style='font-weight:bold'><b>RESSORTS</b></span><span><img src='assets/svg/moins.png' style='width: 30px;height: 15px; margin-left: 20px;'/></span>": geojsonRessort,
       "<span style='font-weight:bold;' ><b>SIM état Normale</b></span><span><img src='assets/svg/sim_loc_vert.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": normalLayerGroup,
       "<span style='font-weight:bold;' ><b>Alarmes Mineures</b></span><span><img src='assets/svg/sim_loc_jaune.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": mineurLayerGroup,
      "<span style='font-weight:bold;' ><b>Alarmes Majeures</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": majeurLayerGroup,
      "<span style='font-weight:bold;' ><b>Alarmes Critiques</b></span><span><img src='assets/svg/sim_loc_rouge.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>": critiqueLayerGroup
    }

    if (layerControl !== null) {
      layerControl.remove()
   }
    layerControl =  L.control.layers(baseMaps, layerGeoJson, {
      collapsed: false,
    }).addTo(this.map);
    
    // Add the layers control to the map
    layerControl.addTo(this.map);
    myLayerGroup.addTo(this.map)
    // normalLayerGroup.addTo(this.map)
    if (this.isNormalLayer) {
       normalLayerGroup.addTo(this.map)
    }
    if (this.isMineureLayer) {
      mineurLayerGroup.addTo(this.map)
    }
    if (this.isMajeureLayer) {
      majeurLayerGroup.addTo(this.map)
    }
    if (this.isCritiqueLayer) {
      critiqueLayerGroup.addTo(this.map)
    }
    this.map.on('overlayremove', (eventLayer) => {
      if (eventLayer.name === "<span style='font-weight:bold;' ><b>SIM état Normale</b></span><span><img src='assets/svg/sim_loc_vert.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>") {
         this.isNormalLayer = false;           
      }
      else if (eventLayer.name === "<span style='font-weight:bold;' ><b>Alarmes Mineures</b></span><span><img src='assets/svg/sim_loc_jaune.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>") {
        this.isMineureLayer = false;           
      }
      else if (eventLayer.name === "<span style='font-weight:bold;' ><b>Alarmes Majeures</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>") {
        this.isMajeureLayer = false;           
      }
      else if (eventLayer.name === "<span style='font-weight:bold;' ><b>Alarmes Critiques</b></span><span><img src='assets/svg/sim_loc_rouge.svg' style='width: 10px; margin-left: 20px; color: #2F02FB;'/></span>") {
        this.isCritiqueLayer = false;           
      }

    });
  }
   GetPositionSimTracking(normalLayer: any = [],mineurLayer: any = [],majeurLayer: any = [],critiqueLayer: any = []) {
    this.zoneTraficService
      .GetPositionSimTracking(this.zoneId).subscribe({
        next: (response) => {
           this.currentTraficLayer = response['data']['trafic']; 
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
          });
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












