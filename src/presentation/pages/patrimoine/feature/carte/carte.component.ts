import {AfterViewInit,Component,Input,ViewChild,ElementRef, OnInit} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';

@Component({
    selector: 'app-carte',
    templateUrl: './carte.component.html',
    styleUrls: ['./carte.component.scss'],
})
export class CarteComponent implements OnInit, AfterViewInit {
    @Input() datas;
    @Input() display: boolean
    @ViewChild('parcelleMap') parcelleMap: ElementRef;
    public listThirdLevelDatas: Array<any> = [];
    geoJsonActif = null;
    geoJsonInactif = null;
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

    constructor(
        private settingService: SettingService,
        public toastrService: ToastrService,
    ) {}

    ngOnInit(): void {
        this.GetAllThirdLevel()
    }
    public ngAfterViewInit(): void {
        this.initMap();
        this.onMapReady();
    }
    initMap() {
      this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw'></div>";
      var  osmLayer = this.OpenStreetMap
        this.map = new L.Map('map');
        this.map.setView(new L.LatLng(5.358363178745869, -3.9440703616814523), 18);
        this.map.options.minZoom = 12;
        this.map.addLayer(osmLayer);
    }
    onMapReady() {
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
      L.Marker.extend({
          options: {
              customWeight: 0
          }
      });
      const makerClusterActif = L.markerClusterGroup({
      }).addTo(this.map);
      const makerClusterInactif = L.markerClusterGroup().addTo(this.map);

      // Initialisation des geojson

      L.geoJSON(this.datas.data.geojson).addTo(this.map);

      this.geoJsonActif = L.geoJSON(this.datas.data.dataset_actifs, {
          pointToLayer: function (feature, latlng) {
              return makerClusterActif.addLayer(L.circleMarker(latlng, geoJsonMarkerActfOptions));
          },
          onEachFeature: function (feature, layer) { },
      }).on('click', (e) => {
      }).addTo(this.map)

      this.geoJsonInactif = L.geoJSON(this.datas.data.dataset_inactifs, {
          pointToLayer: function (feature, latlng) {
              return makerClusterInactif.addLayer(L.circleMarker(latlng, geoJsonMarkerInactfOptions));
          },
          onEachFeature: function (feature, layer) { },
      }).on('click', (e) => {
          console.log("INACTIF", e);
      }).addTo(this.map)

      var baseMaps = {
          'OpenStreetMap': this.OpenStreetMap,
          'Satellite': this.satelite
      }
      var StateMarker = {
          'Actif': this.geoJsonActif,
          'Suspendu': this.geoJsonInactif,
          'Resilié': this.geoJsonInactif,
      }
      L.control.layers(baseMaps, StateMarker, { collapsed: false }).addTo(this.map);
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

}

