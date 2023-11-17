import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MappingService } from 'src/shared/services/mapping.service';

@Component({
  selector: 'app-carte-map',
  templateUrl: './carte-map.component.html',
  styleUrls: ['./carte-map.component.scss']
})
export class CarteMapComponent implements AfterViewInit {

  @Input() patrimoine;
  public map: any;
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

  constructor(
    private mappingService: MappingService
  ) {
    this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
    this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
    this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
  }
  ngAfterViewInit(): void {    
    this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw;width: 100% !important'></div>";
    setTimeout(() => {
      this.onMapReady();    
    }, 1000);
  }
  public onMapReady() {
    var customIcon = L.icon({
      iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
      iconSize: [45, 45],
      iconAnchor: [17, 17],
    });
    var  osmLayer = this.OpenStreetMap
    this.map = new L.Map('map');
    this.map.setView(new L.LatLng(this.patrimoine?.longitude, this.patrimoine?.latitude), 9);
    this.map.options.minZoom = 12;
    var marker = L.marker([this.patrimoine?.longitude, this.patrimoine?.latitude])
      .setIcon(customIcon)
      .bindPopup(
        "<div>" + "" +
        "<strong>Numero SIM :</strong>" + "<span>" + this.patrimoine?.msisdn + "</span>" + "<br>" +
        "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.patrimoine?.direction_regionale?.nom + "</span>" + "<br>" +
        "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.patrimoine?.exploitation?.nom + "</span>" + "<br>" +
        "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.patrimoine?.zone?.nom + "</span>" + "<br>" +
        "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + this.patrimoine?.nom_prenoms + "</span>" + "<br>" +
        "<strong>Statut :</strong>" + "<span>" + this.patrimoine?.statut + "</span>" + "<br>" +
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

}
