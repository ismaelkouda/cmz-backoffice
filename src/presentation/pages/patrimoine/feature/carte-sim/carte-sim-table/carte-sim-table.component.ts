import { carteSimTableConstant } from './../../../data-access/carte-sim/constants/carte-sim-table.constant';
import { QrModalComponent } from './../../../../../../shared/components/qr-modal/qr-modal.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
const Swal = require('sweetalert2');
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as L from 'leaflet';
import { MappingService } from '../../../../../../shared/services/mapping.service';
import { ModalParams } from '../../../../../../shared/constants/modalParams.contant';
import { Observable } from 'rxjs';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
import { BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
import { PatrimoinesService } from '../../../data-access/patrimoines.service';
import { TranslateService } from '@ngx-translate/core';
import {
    SIM_CARD_IDENTIFICATION_ENUM,
    T_SIM_CARD_IDENTIFICATION_ENUM,
} from '../../../../patrimony/data-access/sim-card/enums/sim-card-identification.enum';
import {
    SIM_CARD_STATUS_ENUM,
    T_SIM_CARD_STATUS_ENUM,
} from '../../../../patrimony/data-access/sim-card/enums/sim-card-status.enum';
import { AsFeatureService } from '../../../../../../shared/services/as-feature.service';

type Action = PageAction | ModalAction;
type PageAction = {
    data: Object;
    action: 'view-sim-card' | 'update-sim-card' | 'identification-sim-card';
    view: 'page';
};
type ModalAction = {
    data: Object;
    action: 'map-sim-card' | 'qr-code-sim-card';
    view: 'modal';
};
type ButtonMapSimCardStyle = { disabled: boolean; tooltip: string };
type ButtonMapSimCardData = {
    latitude: string;
    longitude: string;
    date_localisation: string;
    msisdn: string;
};
type ButtonQrCodeSimCardStyle = { disabled: boolean; tooltip: string };
type TYPE_COLOR_IDENTIFICATION_BADGE =
    | 'badge-success'
    | 'badge-warning'
    | 'badge-danger';
type TYPE_COLOR_STATUS_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger';
type ButtonQrCodeSimCardData = { qrcode: string; msisdn: string };

@Component({
    selector: 'app-carte-sim-table',
    templateUrl: './carte-sim-table.component.html',
    styleUrls: ['./carte-sim-table.component.scss'],
})
export class CarteSimTableComponent {
    @Input() listSimCard$: Observable<Array<any>>;
    @Input() simCardSelected: any;
    @Input() pagination: Paginate<any>;
    @Output() interfaceUser = new EventEmitter<any>();
    public asAccessFeatureIdentification: boolean;
    public firstLevelLibel: string;
    public secondLevelLibel: string;
    public thirdLevelLibel: string;
    public visibleSimCardMap = false;
    public readonly table: TableConfig;
    public readonly BADGE_STEP = BADGE_ETAPE;
    public readonly BADGE_STATE = BADGE_ETAT;
    private map: L.Map | null = null;
    private openStreetMap = L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
            attribution: 'PATRIMOINE SIM-MAP',
            detectRetina: false,
            maxNativeZoom: 19,
            maxZoom: 23,
            minZoom: 12,
            noWrap: false,
            opacity: 1,
            subdomains: 'abc',
            tms: false,
        }
    );
    private satellite = L.tileLayer(
        'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        {
            maxZoom: 23,
            minZoom: 10,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'PATRIMOINE SIM-MAP',
        }
    );
    private traficIcon = L.icon({
        iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
        iconSize: [45, 45],
        iconAnchor: [17, 17],
    });
    private networkIcon = L.icon({
        iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
        iconSize: [45, 45],
        iconAnchor: [17, 17],
    });

    constructor(
        public toastService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private asFeatureService: AsFeatureService,
        private mappingService: MappingService,
        private patrimoinesService: PatrimoinesService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService
    ) {
        this.asAccessFeatureIdentification = this.asFeatureService.hasFeature(
            OperationTransaction.IDENTIFICATION
        );
        this.table = carteSimTableConstant(this.asFeatureService);
        this.firstLevelLibel = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibel = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibel = this.mappingService.structureGlobale?.niveau_3;
    }

    public pageCallback() {
        this.patrimoinesService.fetchSims({});
    }

    public onExportExcel(): void {
        this.listSimCard$.subscribe((data) => {
            if (data) {
                this.tableExportExcelFileService.exportAsExcelFile(
                    data,
                    this.table,
                    'list_sim_cards'
                );
            }
        });
    }

    public copyToClipboard(data: string): void {
        const translatedMessage = this.translate.instant(
            'COPIED_TO_THE_CLIPBOARD'
        );
        this.toastService.success(translatedMessage);
        this.clipboardService.copyFromContent(data);
    }

    getStatusSimCardBadge(selectedSimCard?: {
        statut: T_SIM_CARD_STATUS_ENUM;
    }): TYPE_COLOR_STATUS_BADGE {
        if (!selectedSimCard || !selectedSimCard.statut) {
            return 'badge-dark';
        }

        const etapeMap: Record<
            T_SIM_CARD_STATUS_ENUM,
            TYPE_COLOR_STATUS_BADGE
        > = {
            [SIM_CARD_STATUS_ENUM.ACTIVE]: 'badge-success',
            [SIM_CARD_STATUS_ENUM.SUSPENDED]: 'badge-dark',
            [SIM_CARD_STATUS_ENUM.RESILIATE]: 'badge-danger',
        };
        return etapeMap[selectedSimCard.statut] || 'badge-dark';
    }

    getIdentificationSimCardBadge(
        selectedSimCard?: any
    ): TYPE_COLOR_IDENTIFICATION_BADGE {
        if (!selectedSimCard || !selectedSimCard.identification_fiabilite) {
            return 'badge-success';
        }

        const etapeMap: Record<
            T_SIM_CARD_IDENTIFICATION_ENUM,
            TYPE_COLOR_IDENTIFICATION_BADGE
        > = {
            [SIM_CARD_IDENTIFICATION_ENUM.RELIABLE]: 'badge-success',
            [SIM_CARD_IDENTIFICATION_ENUM.IN_PROGRESS]: 'badge-warning',
            [SIM_CARD_IDENTIFICATION_ENUM.UNRELIABLE]: 'badge-danger',
        };
        return (
            etapeMap[selectedSimCard.identification_fiabilite] ||
            'badge-success'
        );
    }

    private onSelectSimCard(selectedSimCard: any): void {
        this.simCardSelected = selectedSimCard;
        this.patrimoinesService.setSimsSelected(selectedSimCard);
    }

    public handleAction(params: Action): void {
        this.onSelectSimCard(params.data);

        switch (params.view) {
            case 'modal':
                if (params.action === 'map-sim-card') {
                    this.handleSimCardMap(params.data);
                }
                if (params.action === 'qr-code-sim-card') {
                    this.handleSimCardQrCode(params.data);
                }
                break;

            case 'page':
                if (params.action === 'view-sim-card') {
                    this.interfaceUser.emit(params);
                }
                if (params.action === 'update-sim-card') {
                    this.interfaceUser.emit(params);
                }
                if (params.action === 'identification-sim-card') {
                    this.interfaceUser.emit(params);
                }
                break;
        }
    }
    // Méthode pour gérer l'affichage de la carte
    private async handleSimCardMap(selectedSimCard: any): Promise<void> {
        this.visibleSimCardMap = true;
        try {
            const gpsCoordinates = this.getGpsCoordinates(selectedSimCard);
            if (!gpsCoordinates) {
                console.error('Coordonnées GPS invalides');
                return;
            }
            this.initializeMap(gpsCoordinates, selectedSimCard);
        } catch (error) {
            console.error(
                "🚨 Erreur lors de l'initialisation de la carte :",
                error
            );
        }
    }
    // Méthode pour créer un marqueur avec un popup
    private createMarker(
        simCard: any,
        icon: L.Icon,
        type: 'trafic' | 'reseau'
    ): L.Marker {
        const coordinates: L.LatLngExpression =
            type === 'trafic'
                ? [
                      parseFloat(simCard.longitude ?? ''),
                      parseFloat(simCard.latitude ?? ''),
                  ]
                : [
                      parseFloat(simCard.long_reseau ?? ''),
                      parseFloat(simCard.lat_reseau ?? ''),
                  ];
        const marker = L.marker(coordinates, { icon });
        const popupContent = this.generatePopupContent(simCard, type);
        marker.bindPopup(popupContent).openPopup();
        return marker;
    }
    private initializeMap(
        coords: [number, number],
        selectedSimCard: any
    ): void {
        setTimeout(() => {
            const mapContainer = document.getElementById('containerSimCardMap');

            if (!mapContainer) {
                console.error('Élément #containerSimCardMap introuvable !');
                return;
            }

            if (this.map) {
                this.map.remove();
                this.map = null;
            }

            this.map = L.map('containerSimCardMap', {
                center: coords,
                zoom: 17,
                layers: [this.openStreetMap],
            });

            if (!this.map) {
                console.error("❌ La carte Leaflet n'a pas été initialisée !");
                return;
            }

            if (this.map) {
                const traficMarker = this.createMarker(
                    selectedSimCard,
                    this.traficIcon,
                    'trafic'
                );
                const networkMarker = this.createMarker(
                    selectedSimCard,
                    this.networkIcon,
                    'reseau'
                );

                traficMarker.addTo(this.map);
                networkMarker.addTo(this.map);

                const baseMaps = {
                    OpenStreetMap: this.openStreetMap,
                    Satellite: this.satellite,
                };
                const layerGeoJson = {
                    'Position déclarée': traficMarker,
                    'Position trafic': networkMarker,
                };
                L.control
                    .layers(baseMaps, layerGeoJson, { collapsed: true })
                    .addTo(this.map);
            } else {
                console.error(
                    "Impossible d'ajouter des marqueurs : la carte Leaflet est undefined !"
                );
            }
        }, 300);
    }
    private generatePopupContent(
        simCard: any,
        type: 'trafic' | 'reseau'
    ): string {
        return `
            <div>
                <strong>Numéro SIM :</strong> <span>${
                    simCard.msisdn ?? ''
                }</span><br>
                <strong>${this.firstLevelLibel} :</strong> <span>${
            simCard.niveau_uns_nom ?? ''
        }</span><br>
                <strong>${this.secondLevelLibel} :</strong> <span>${
            simCard.niveau_deux_nom ?? ''
        }</span><br>
                <strong>Type d'emplacement :</strong> <span>${
                    simCard.niveau_trois_nom ?? ''
                }</span><br>
                <strong>Nom Emplacement :</strong> <span>${
                    simCard.point_emplacement ?? ''
                }</span><br>
                ${
                    type === 'reseau'
                        ? `
                    <strong>Site :</strong> <span>${
                        simCard.site_reseau ?? ''
                    }</span><br>
                    <strong>Geoloc :</strong> <span>${
                        simCard.geoloc ?? ''
                    }</span><br>
                    <strong>Quartier :</strong> <span>${
                        simCard.quartier ?? ''
                    }</span><br>
                    <strong>Date Trafic :</strong> <span>${
                        simCard.date_localisation ?? ''
                    }</span><br>
                `
                        : ''
                }
                <strong>Statut :</strong> <span>${
                    simCard.statut ?? ''
                }</span><br>
                <strong>Coordonnées GPS :</strong> <span>${
                    type === 'trafic'
                        ? `${simCard.longitude ?? ''}, ${
                              simCard.latitude ?? ''
                          }`
                        : `${simCard.long_reseau ?? ''}, ${
                              simCard.lat_reseau ?? ''
                          }`
                }
                </span><br>
            </div>
        `;
    }
    private getGpsCoordinates(selectedSimCard: any): [number, number] | null {
        const longitude = parseFloat(
            selectedSimCard.longitude ?? selectedSimCard.long_reseau ?? ''
        );
        const latitude = parseFloat(
            selectedSimCard.latitude ?? selectedSimCard.lat_reseau ?? ''
        );
        if (isNaN(longitude) || isNaN(latitude)) {
            return null;
        }
        return [longitude, latitude];
    }

    handleSimCardQrCode(selectedSimCard: any): void {
        if (selectedSimCard) {
            const qrCodeModalRef = this.ngbModal.open(QrModalComponent, {
                ...ModalParams,
                size: 'lg',
                backdrop: true,
                keyboard: true,
            });
            qrCodeModalRef.componentInstance.simCard = selectedSimCard;
        } else {
            Swal.fire('PATRIMOINE SIM', 'Aucun QRCode enregistré', 'info');
        }
    }

    hideDialog(): void {
        this.visibleSimCardMap = false;
    }

    getTreatmentButtonViewSimCardStyle(selectedSimCard: { msisdn: string }): {
        tooltip: string;
    } {
        const DETAILS_OF_THE_SIM = this.translate
            .instant('DETAILS_OF_THE_SIM')
            .replace('{MSISDN}', selectedSimCard.msisdn);
        return { tooltip: DETAILS_OF_THE_SIM };
    }

    // public onShowDialog(typeDialog: "map", selectCarteSim: Object) {
    //   // this.onSelectTableCarteSim(params.data);
    //   switch (typeDialog) {
    //     case "map": {
    //       this.display = true;
    //       this.onDialogMaximized(true);
    //       this.currentComposant = selectCarteSim;
    //       this.OpenStreetMap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //         attribution: 'PATRIMOINE SIM-MAP',
    //         detectRetina: false,
    //         maxNativeZoom: 19,
    //         maxZoom: 23,
    //         minZoom: 12,
    //         noWrap: false,
    //         opacity: 1,
    //         subdomains: 'abc',
    //         tms: false,
    //       })
    //       this.satelite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    //         maxZoom: 23,
    //         minZoom: 10,
    //         subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    //         attribution: 'PATRIMOINE SIM-MAP',
    //       })
    //       setTimeout(() => {
    //         this.parcelleMap.nativeElement.innerHTML = "<div id='map' style='height: 45vw'></div>";
    //         this.onMapReady();
    //       }, 1000);
    //       break;
    //     }
    //   }
    // }
    // public onDialogMaximized(event): void {
    //   event.maximized ? (this.isMaximized = true) : (this.isMaximized = false);
    // }

    // private onMapReady() {
    //   var traficIcon = L.icon({
    //     iconUrl: '../../../../../assets/svg/sim_loc_noir.svg',
    //     iconSize: [45, 45],
    //     iconAnchor: [17, 17],
    //   });
    //   var networkIcon = L.icon({
    //     iconUrl: '../../../../../assets/svg/sim_loc_orange.svg',
    //     iconSize: [45, 45],
    //     iconAnchor: [17, 17],
    //   });
    //   var osmLayer = this.OpenStreetMap
    //   this.map = new L.Map('map');
    //   this.map.setView(new L.LatLng(this.currentComposant?.longitude ?? this.currentComposant?.long_reseau, this.currentComposant?.latitude ?? this.currentComposant?.lat_reseau), 18);
    //   this.map.options.minZoom = 12;

    //   var traficPoint = L.marker([this.currentComposant?.longitude ?? this.currentComposant?.long_reseau, this.currentComposant?.latitude ?? this.currentComposant?.lat_reseau])
    //     .setIcon(traficIcon)
    //     .bindPopup(
    //       "<div>" + "" +
    //       "<strong>Numéro SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
    //       "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
    //       "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
    //       //"<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
    //       "<strong>" + "Type d'emplacement :" + "</strong>" + "<span>" + `${this.currentComposant?.niveau_trois_nom ?? ""}` + "</span>" + "<br>" +
    //       "<strong>" + "Nom Emplacement :" + "</strong>" + "<span>" + `${this.currentComposant?.point_emplacement ?? ""}` + "</span>" + "<br>" +
    //       "<strong>Statut :</strong>" + "<span>" + `${this.currentComposant?.statut ?? ""}` + "</span>" + "<br>" +
    //       "<strong>Coordonnées GPS :</strong>" + "<span>" + `${this.currentComposant?.longitude ?? ""}` + `${this.currentComposant?.longitude ? "," : ""}` + `${this.currentComposant?.latitude ?? ""}` + "</span>" + "<br>" +
    //       "</div>"
    //     ).openPopup();

    //   var reseauPoint = L.marker([this.currentComposant?.long_reseau ?? this.currentComposant?.longitude, this.currentComposant?.lat_reseau ?? this.currentComposant?.latitude])
    //     .setIcon(networkIcon)
    //     .bindPopup(
    //       "<div>" + "" +
    //       "<strong>Numéro SIM :</strong>" + "<span>" + this.currentComposant?.msisdn + "</span>" + "<br>" +
    //       "<strong>" + this.firstLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_uns_nom + "</span>" + "<br>" +
    //       "<strong>" + this.secondLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_deux_nom + "</span>" + "<br>" +
    //       //"<strong>" + this.thirdLevelLibelle + " :</strong>" + "<span>" + this.currentComposant?.niveau_trois_nom + "</span>" + "<br>" +
    //       "<strong>" + "Type d'emplacement :</strong>" + "<span>" + `${this.currentComposant?.niveau_trois_nom ?? ""}` + "</span>" + "<br>" +
    //       "<strong>" + "Nom Emplacement :</strong>" + "<span>" + `${this.currentComposant?.point_emplacement ?? ""}` + "</span>" + "<br>" +
    //       // Affiche la ligne Geoloc, même si adresse_geographique est null
    //       "<strong>Site :</strong> <span>" + (this.currentComposant?.site_reseau ?? "") + "</span><br>" +
    //       "<strong>Geoloc :</strong> <span>" + (this.currentComposant?.geoloc ?? "") + "</span><br>" +
    //       "<strong>Quartier :</strong>" + "<span>" + `${this.currentComposant?.quartier ?? ""}` + "</span>" + "<br>" +
    //       "<strong>Statut :</strong>" + "<span>" + `${this.currentComposant?.statut ?? ""}` + "</span>" + "<br>" +
    //       "<strong>Date Trafic :</strong>" + "<span>" + `${this.currentComposant?.date_localisation ?? ""}` + "</span>" + "<br>" +
    //       "<strong>Coordonnées GPS :</strong>" + "<span>" + `${this.currentComposant?.long_reseau ?? ""}` + `${this.currentComposant?.long_reseau ? "," : ""}` + `${this.currentComposant?.lat_reseau ?? ""}` + "</span>" + "<br>" +
    //       "</div>"
    //     ).openPopup();

    //   traficPoint.addTo(this.map);
    //   reseauPoint.addTo(this.map);
    //   this.map.addLayer(osmLayer);
    //   var baseMaps = {
    //     'OpenStreetMap': this.OpenStreetMap.addTo(this.map),
    //     'Satellite': this.satelite
    //   }
    //   var layerGeoJson = {
    //     "<span style='font-weight:bold;'><b>Position déclarée</b></span><span><img src='assets/svg/sim_loc_noir.svg' style='width: 10px; margin-left: 20px;'/></span>": traficPoint,
    //     "<span style='font-weight:bold'><b>Position trafic</b></span><span><img src='assets/svg/sim_loc_orange.svg' style='width: 10px; margin-left: 20px;'/></span>": reseauPoint,
    //   }
    //   L.control.layers(baseMaps, layerGeoJson, { collapsed: false }).addTo(this.map);
    // }
    // public hideDialog(typeDialog: "map") {
    //   switch (typeDialog) {
    //     case "map": {
    //       this.display = false;
    //       break;
    //     }
    //   }
    // }

    getTreatmentButtonMapSimCardStyle(
        selectedSimCard: ButtonMapSimCardData
    ): ButtonMapSimCardStyle {
        const LOCATION_OF_THE_SIM = this.translate.instant(
            'LOCATION_OF_THE_SIM'
        );
        const CANNOT_SEE_THE_LOCATION = this.translate.instant(
            'CANNOT_SEE_THE_LOCATION'
        );
        if (
            !selectedSimCard?.latitude &&
            !selectedSimCard?.longitude &&
            !selectedSimCard?.date_localisation
        ) {
            return { disabled: true, tooltip: CANNOT_SEE_THE_LOCATION };
        }
        return {
            disabled: false,
            tooltip: LOCATION_OF_THE_SIM.replace(
                '{MSISDN}',
                selectedSimCard.msisdn
            ),
        };
    }

    getTreatmentButtonQrCodeSimCardStyle(
        selectedSimCard: ButtonQrCodeSimCardData
    ): ButtonQrCodeSimCardStyle {
        const QR_CODE_OF_THE_SIM = this.translate.instant('QR_CODE_OF_THE_SIM');
        const CANNOT_SEE_THE_QR_CODE = this.translate.instant(
            'CANNOT_SEE_THE_QR_CODE'
        );
        if (!selectedSimCard?.qrcode) {
            return { disabled: true, tooltip: CANNOT_SEE_THE_QR_CODE };
        }
        return {
            disabled: true,
            tooltip: QR_CODE_OF_THE_SIM.replace(
                '{MSISDN}',
                selectedSimCard.msisdn
            ),
        };
    }
}
