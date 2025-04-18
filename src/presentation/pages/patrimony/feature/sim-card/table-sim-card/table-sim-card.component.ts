import { AsFeatureService } from './../../../../../../shared/services/as-feature.service';
import { simCardApiService } from './../../../data-access/sim-card/services/sim-card-api.service';
import {
    SIM_CARD_IDENTIFICATION_ENUM,
    T_SIM_CARD_IDENTIFICATION_ENUM,
} from './../../../data-access/sim-card/enums/sim-card-identification.enum';
import { SIM_CARD_STATUS_ENUM } from './../../../data-access/sim-card/enums/sim-card-status.enum';
import { simCardInterface } from './../../../data-access/sim-card/interfaces/sim-card.interface';
import { ModalParams } from './../../../../../../shared/constants/modalParams.contant';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
    TableConfig,
    TableExportExcelFileService,
} from '../../../../../../shared/services/table-export-excel-file.service';
import { BADGE_ETAT } from '../../../../../../shared/constants/badge-etat.contant';
import { BADGE_ETAPE } from '../../../../../../shared/constants/badge-etape.constant';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { simCardTableConstant } from '../../../data-access/sim-card/constants/sim-card-table.constant';
import { Observable } from 'rxjs';
import { T_SIM_CARD_STATUS_ENUM } from '../../../data-access/sim-card/enums/sim-card-status.enum';
import * as L from 'leaflet';
const Swal = require('sweetalert2');
import { TranslateService } from '@ngx-translate/core';
import { QrModalComponent } from '../../../../../../shared/components/qr-modal/qr-modal.component';
import { simCardFilterInterface } from '../../../data-access/sim-card/interfaces/sim-card-filter.interface';
import { OperationTransaction } from '../../../../../../shared/enum/OperationTransaction.enum';
import { StoreCurrentUserService } from '../../../../../../shared/services/store-current-user.service';

type Action = PageAction | ModalAction;
type PageAction = {
    data: simCardInterface;
    action: 'view-sim-card' | 'update-sim-card' | 'identification-sim-card';
    view: 'page';
};
type ModalAction = {
    data: simCardInterface;
    action: 'map-sim-card' | 'qr-code-sim-card';
    view: 'modal';
};
type TYPE_COLOR_IDENTIFICATION_BADGE =
    | 'badge-success'
    | 'badge-warning'
    | 'badge-danger';
type TYPE_COLOR_STATUS_BADGE =
    | 'badge-warning'
    | 'badge-dark'
    | 'badge-success'
    | 'badge-danger';
type ButtonMapSimCardStyle = { disabled: boolean; tooltip: string };
type ButtonMapSimCardData = {
    latitude: string;
    lat_reseau: string;
    date_localisation: string;
    msisdn: string;
};
type ButtonQrCodeSimCardStyle = { disabled: boolean; tooltip: string };
type ButtonQrCodeSimCardData = { qrcode: string; msisdn: string };

@Component({
    selector: 'app-table-sim-card',
    templateUrl: './table-sim-card.component.html',
    styles: [
        `
            .map {
                width: 100%;
                height: 100vh;
                min-height: 400px;
                display: block;
            }
        `,
    ],
})
export class TableSimCardComponent {
    @Input() spinner: boolean;
    @Input() listSimCard$: Observable<Array<simCardInterface>>;
    @Input() simCardSelected: simCardInterface;
    @Input() pagination$: Observable<Paginate<simCardInterface>>;
    @Output() interfaceUser = new EventEmitter<any>();
    public asAccessFeatureIdentification: boolean;
    public firstLevelLibel: string | undefined;
    public secondLevelLibel: string | undefined;
    public thirdLevelLibel: string | undefined;
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
        private toastService: ToastrService,
        private clipboardService: ClipboardService,
        private ngbModal: NgbModal,
        private simCardApiService: simCardApiService,
        private tableExportExcelFileService: TableExportExcelFileService,
        private translate: TranslateService,
        private asFeatureService: AsFeatureService,
        private storeCurrentUserService: StoreCurrentUserService
    ) {
        this.asAccessFeatureIdentification = this.asFeatureService.hasFeature(
            OperationTransaction.IDENTIFICATION
        );
        this.table = simCardTableConstant(this.asFeatureService);
        const currentUser = this.storeCurrentUserService.getCurrentUser;
        this.firstLevelLibel =
            currentUser?.structure_organisationnelle?.niveau_1;
        this.secondLevelLibel =
            currentUser?.structure_organisationnelle?.niveau_2;
        this.thirdLevelLibel =
            currentUser?.structure_organisationnelle?.niveau_3;
    }

    public pageCallback() {
        this.simCardApiService.fetchSimCard({} as simCardFilterInterface);
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

    getIdentificationSimCardBadge(selectedSimCard?: {
        identification_fiabilite: T_SIM_CARD_IDENTIFICATION_ENUM;
    }): TYPE_COLOR_IDENTIFICATION_BADGE {
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

    private onSelectSimCard(selectedSimCard: simCardInterface): void {
        this.simCardSelected = selectedSimCard;
        this.simCardApiService.setSimCardSelected(selectedSimCard);
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
    private async handleSimCardMap(
        selectedSimCard: simCardInterface
    ): Promise<void> {
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
    private getGpsCoordinates(selectedSimCard: any): [number, number] | null {
        const longitude = parseFloat(
            selectedSimCard.longitude ?? selectedSimCard.long_reseau ?? ''
        );
        console.log('longitude', longitude);
        const latitude = parseFloat(
            selectedSimCard.latitude ?? selectedSimCard.lat_reseau ?? ''
        );
        console.log('latitude', latitude);
        if (isNaN(longitude) || isNaN(latitude)) {
            return null;
        }
        return [longitude, latitude];
    }
    private initializeMap(
        coords: [number, number],
        selectedSimCard: simCardInterface
    ): void {
        console.log('coords', coords);
        setTimeout(() => {
            const mapContainer = document.getElementById('containerSimCardMap');
            if (!mapContainer) {
                console.error(
                    "Élément HTMLElement id='containerSimCardMap' introuvable !"
                );
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
                console.error("La carte Leaflet n'a pas été initialisée !");
                return;
            }

            if (this.map) {
                const traficMarker = this.createMarker(
                    selectedSimCard,
                    coords,
                    this.traficIcon,
                    'trafic'
                );
                const networkMarker = this.createMarker(
                    selectedSimCard,
                    coords,
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
                    .layers(baseMaps, layerGeoJson, { collapsed: false })
                    .addTo(this.map);
            } else {
                console.error(
                    "Impossible d'ajouter des marqueurs : la carte Leaflet est undefined !"
                );
            }
        }, 300);
    }
    // Méthode pour créer un marqueur avec un popup
    private createMarker(
        simCard: any,
        coords: any,
        icon: L.Icon,
        type: 'trafic' | 'reseau'
    ): L.Marker {
        const coordinates: L.LatLngExpression =
            type === 'trafic'
                ? [
                      parseFloat(simCard.longitude ?? simCard.long_reseau),
                      parseFloat(simCard.latitude ?? simCard.lat_reseau),
                  ]
                : [
                      parseFloat(simCard.long_reseau ?? simCard.longitude),
                      parseFloat(simCard.lat_reseau ?? simCard.latitude),
                  ];
        const marker = L.marker(coordinates, { icon });
        // const coordinates: L.LatLngExpression = [parseFloat(coords[0] ?? ''), parseFloat(coords[1] ?? '')]
        // const marker = L.marker(coordinates, { icon });
        const popupContent = this.generatePopupContent(simCard, type);
        marker.bindPopup(popupContent).openPopup();
        return marker;
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

    public handleSimCardQrCode(selectedSimCard: simCardInterface): void {
        if (selectedSimCard) {
            const qrCodeModalRef = this.ngbModal.open(QrModalComponent, {
                ...ModalParams,
                backdrop: true,
                keyboard: true,
            });
            qrCodeModalRef.componentInstance.qr = selectedSimCard;
        } else {
            Swal.fire('PATRIMOINE SIM', 'Aucun QRCode enregistré', 'info');
        }
    }

    public hideDialog(): void {
        this.visibleSimCardMap = false;
    }

    public getTreatmentButtonViewSimCardStyle(selectedSimCard: {
        msisdn: string;
    }): { tooltip: string } {
        const DETAILS_OF_THE_SIM = this.translate
            .instant('DETAILS_OF_THE_SIM')
            .replace('{MSISDN}', selectedSimCard.msisdn);
        return { tooltip: DETAILS_OF_THE_SIM };
    }

    public getTreatmentButtonMapSimCardStyle(
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
            !selectedSimCard?.lat_reseau &&
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

    public getTreatmentButtonQrCodeSimCardStyle(
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
            disabled: false,
            tooltip: QR_CODE_OF_THE_SIM.replace(
                '{MSISDN}',
                selectedSimCard.msisdn
            ),
        };
    }
}
