import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { ModalParams } from 'src/shared/constants/modalParams.contant';
const Swal = require('sweetalert2');
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QrModalComponent } from 'src/shared/components/qr-modal/qr-modal.component';
import { CarteSimStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-state.service';

type TYPEFORM = "details" | "editer";
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
    @Output() interfaceUser = new EventEmitter<{data: Object, paramUrl: TYPEFORM}>();
    public selectedTableCarteSim: Object;

    constructor(public toastrService: ToastrService, private clipboardService: ClipboardService,
        private ngbModal: NgbModal, private carteSimStateService: CarteSimStateService) {}

    ngOnInit(): void {
        this.selectedTableCarteSim = this.carteSimStateService.getTableItemSelectedState();
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
      this.onSelectedTableCarteSim(selectCarteSim);
      if (selectCarteSim['qrcode']) {
        const modalRef = this.ngbModal.open(QrModalComponent, ModalParams);
        modalRef.componentInstance.qr = selectCarteSim;
      } else {
        Swal.fire("PATRIMOINE SIM", "Aucun QRCode enregistré", "info");
      }
    }

    public onShowForm(selectCarteSim: Object, typeForm: TYPEFORM): void {
        this.carteSimStateService.setTableItemSelectedState(selectCarteSim);
        this.onSelectedTableCarteSim(selectCarteSim);
        this.interfaceUser.emit({ data: selectCarteSim, paramUrl: typeForm });
    }

    public onShowDialog(selectCarteSim: Object) {
      this.carteSimStateService.setTableItemSelectedState(selectCarteSim);
      // this.display = true;
      // this.onDialogMaximized(true);
      // this.currentComposant = composant;
      // this.OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      //   attribution: 'PATRIMOINE SIM-MAP',
      //   detectRetina: false,
      //   maxNativeZoom: 19,
      //   maxZoom: 23,
      //   minZoom: 12,
      //   noWrap: false,
      //   opacity: 1,
      //   subdomains: 'abc',
      //   tms: false,
      // })
      // this.satelite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      //   maxZoom: 23,
      //   minZoom: 10,
      //   subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      //   attribution: 'PATRIMOINE SIM-MAP',
      // })
      // setTimeout(() => {
      //   this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw'></div>";
      //   this.onMapReady();
      // }, 1000);
    }

}