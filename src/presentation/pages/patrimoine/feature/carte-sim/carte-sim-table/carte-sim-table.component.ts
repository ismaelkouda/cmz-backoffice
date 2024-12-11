import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
const Swal = require('sweetalert2');
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QrModalComponent } from 'src/shared/components/qr-modal/qr-modal.component';
import { CarteSimStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-state.service';
import * as L from 'leaflet';

type Action = PageAction;
type PageAction = { data: Object, action: 'détails', view: 'page' }|{ data: Object, action: 'editer', view: 'page' }|{ data: Object, action: 'identifier', view: 'page' };
type TYPECOPY = "msisdn" | "imsi";

@Component({
    selector: 'app-carte-sim-table',
    templateUrl: './carte-sim-table.component.html'
})

export class CarteSimTableComponent implements OnInit {
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    @Input() pargination;
    @Input() spinner: boolean;
    @Input() listCartesSim: Array<Object>;
    @Output() interfaceUser = new EventEmitter<PageAction>();
    public selectedTableCarteSim: Object;
    public display: boolean = false;
    private isMaximized: boolean = false;
    public currentComposant: any;
    public map: any;

    @ViewChild('parcelleMap') parcelleMap: ElementRef;

    OpenStreetMap: L.TileLayer = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
    satelite: L.TileLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 23,
      minZoom: 10,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'PATRIMOINE SIM-MAP',
    })

    constructor(public toastrService: ToastrService, private clipboardService: ClipboardService,
        private ngbModal: NgbModal, private carteSimStateService: CarteSimStateService) {}

    ngOnInit(): void {
        // this.selectedTableCarteSim = this.carteSimStateService.getTableItemSelectedState();
        console.log('this.listCartesSim', this.listCartesSim)
    }

    public copyData(selectCarteSim: Object, type: TYPECOPY): void { 
      this.toastrService.success('Copié dans le presse papier');
      this.clipboardService.copyFromContent(selectCarteSim[type]);
      this.onSelectedTableCarteSim(selectCarteSim);
    }

    private onSelectedTableCarteSim(selectCarteSim: Object): void {
      this.selectedTableCarteSim = selectCarteSim;
    }
  
    public OnShowQr(selectCarteSim: Object) {
      console.log('selectCarteSim', selectCarteSim?.["qrcode"])
      this.onSelectedTableCarteSim(selectCarteSim);
      if (selectCarteSim['qrcode']) {
        const modalRef = this.ngbModal.open(QrModalComponent, {...ModalParams, backdrop: true, keyboard: true});
        modalRef.componentInstance.qr = selectCarteSim;
      } else {
        Swal.fire("PATRIMOINE SIM", "Aucun QRCode enregistré", "info");
      }
    }

    public onShowForm(params: Action): void {
        this.onSelectedTableCarteSim(params.data);
        if (params.view === 'page') {
          switch (params.action) {
            case "détails":
              case "editer":
                case "identifier":
              this.interfaceUser.emit(params);
              break;
          }
        }
    }

    public onShowDialog(typeDialog: "map", selectCarteSim: Object) {
      // this.onSelectTableCarteSim(params.data);
      switch (typeDialog) {
        case "map": {
          this.display = true;
          this.onDialogMaximized(true);
          this.currentComposant = selectCarteSim;
          this.OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
          this.satelite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 23,
            minZoom: 10,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'PATRIMOINE SIM-MAP',
          })
          setTimeout(() => {
            this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw'></div>";
            this.onMapReady();
          }, 1000);
          break;
        }
      }
    }
    public onDialogMaximized(event): void {
      event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
    }

    private onMapReady() {
      var traficIcon = L.icon({
        iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
        iconSize: [45, 45],
        iconAnchor: [17, 17],
      });
      var networkIcon = L.icon({
        iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
        iconSize: [45, 45],
        iconAnchor: [17, 17],
      });
      var osmLayer = this.OpenStreetMap
      this.map = new L.Map('map');
      this.map.setView(new L.LatLng(this.currentComposant?.longitude ?? this.currentComposant?.long_reseau, this.currentComposant?.latitude ?? this.currentComposant?.lat_reseau), 18);
      this.map.options.minZoom = 12;
  
      var traficPoint = L.marker([this.currentComposant?.longitude ?? this.currentComposant?.long_reseau, this.currentComposant?.latitude ?? this.currentComposant?.lat_reseau])
        .setIcon(traficIcon)
        .bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
          "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
          "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
          "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
          "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + this.currentComposant?.point_emplacement + "</span>" + "<br>" +
          "<strong>Statut :</strong>" + "<span>" + this.currentComposant?.statut + "</span>" + "<br>" +
          "<strong>Coordonnées GPS :</strong>" + "<span>" + this.currentComposant?.longitude + "," + this.currentComposant?.latitude + "</span>" + "<br>" +
          "</div>"
        ).openPopup();
  
      var reseauPoint = L.marker([this.currentComposant?.long_reseau, this.currentComposant?.lat_reseau])
        .setIcon(networkIcon)
        .bindPopup(
          "<div>" + "" +
          "<strong>Numero SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
          "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
          "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
          "<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
          "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + this.currentComposant?.point_emplacement + "</span>" + "<br>" +
          "<strong>" + "Date Trafic :" + "</strong>" + "<span>" + this.currentComposant?.date_id + "</span>" + "<br>" +
          "<strong>Statut :</strong>" + "<span>" + this.currentComposant?.statut + "</span>" + "<br>" +
          "<strong>Coordonnées GPS :</strong>" + "<span>" + this.currentComposant?.long_reseau + "," + this.currentComposant?.lat_reseau + "</span>" + "<br>" +
          "</div>"
        ).openPopup();
  
      traficPoint.addTo(this.map);
      reseauPoint.addTo(this.map);
      this.map.addLayer(osmLayer);
      var baseMaps = {
        'OpenStreetMap': this.OpenStreetMap.addTo(this.map),
        'Satellite': this.satelite
      }
      var layerGeoJson = {
        "<span style='font-weight:bold;'><b>Position déclarée</b></span><span><img src='assets/svg/sim_loc_noir.svg' style='width: 10px; margin-left: 20px;'/></span>": traficPoint,
        "<span style='font-weight:bold'><b>Position trafic</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px;'/></span>": reseauPoint,
      }
      L.control.layers(baseMaps, layerGeoJson, { collapsed: false }).addTo(this.map);
    }
    public hideDialog(typeDialog: "map") {
      switch (typeDialog) {
        case "map": {
          this.display = false;
          break;
        }
      }
    }

}