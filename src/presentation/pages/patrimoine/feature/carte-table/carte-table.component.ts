import { MapService } from './../../../../../shared/services/map.service';
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClipboardService } from "ngx-clipboard";
import { ToastrService } from "ngx-toastr";
import { QrModalComponent } from 'src/shared/components/qr-modal/qr-modal.component';
const Swal = require('sweetalert2');
import * as L from 'leaflet';

@Component({
    selector: 'app-carte-table',
    templateUrl: './carte-table.component.html'
})

export class CarteTableComponent {
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
    carte = new MapService();
    @Input() firstLevelLibelle: string;
    @Input() secondLevelLibelle: string;
    @Input() thirdLevelLibelle: string;
    @Input() listPatrimoines;
    public response: any = {};
    @Input() pargination;
    public itemCatreSim: {};
    public display: boolean = false;

    constructor(public toastrService: ToastrService, private clipboardApi: ClipboardService,
                private modalService: NgbModal,
    ) {}
    
  copyData(data: any): void {
    this.toastrService.success('Copié dans le presse papier');
    this.clipboardApi.copyFromContent(data);
  }
  public OnShowQr(data) {
    this.onMarkItemCarteSim(data);
    if (data.qrcode) {
      const modalRef = this.modalService.open(QrModalComponent, {
        ariaLabelledBy: "modal-basic-title",
        keyboard: false,
        centered: true,
      });
      modalRef.componentInstance.qr = data;
    } else {
      Swal.fire("PATRIMOINE SIM", "Aucun QRCode enregistré", "info");
    }
  }
  public onDialogMaximized(event) {
    event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
  }
  
  public showDialog(data, composant) {
    this.onMarkItemCarteSim(data);
    switch (data) {
      case "map": {
        this.display = true;
        this.onDialogMaximized(true);
        this.currentComposant = composant;
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

  onMarkItemCarteSim(data) {
    this.itemCatreSim = data;
  }
}