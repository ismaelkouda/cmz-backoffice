import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { StateWhiteSimCardService } from '../../../data-access/white-sim-card/state-approbation.service';
import { handle } from '../../../../../../shared/functions/api.function';
import { WhiteSimCardDetails, WhiteSimCardDetailsResponse } from './data-access/white-sim-card-details/table-white-sim-card-details';
import { PatrimoinesService } from '../../../data-access/patrimoines.service';
import { DossierWhiteSimCard, WhiteSimCardPaginatedResponse } from '../../../data-access/white-sim-card/table-white-sim-card';

type TYPEVIEW = "détails";
const TYPEVIEW_VALUES: TYPEVIEW[] = ["détails"];
function isTypeView(value: any): value is TYPEVIEW {
    return TYPEVIEW_VALUES.includes(value);
}
type PageAction = { 'data': Object, 'action': 'détails', 'view': 'page' };

@Component({
    selector: "app-white-sim-card-details",
    templateUrl: "./white-sim-card-details.component.html"
})

export class WhiteSimCardDetailsComponent implements OnInit {
    public spinner: boolean = true;
    public module: string;
    public subModule: string;
    public urlParamRef: TYPEVIEW;
    public urlParamId: number|null;
    public urlParamFilter: Object;
    public urlParamCurrentPage: string;
    public filterData: Object;
    public listWhiteSimCard: Array<DossierWhiteSimCard>;
    public selectedWhiteSimCard: DossierWhiteSimCard|undefined;
    public listWhiteSimCardDetails: WhiteSimCardDetails;
    public displayUrlErrorPage: boolean = false;

    constructor(private activatedRoute: ActivatedRoute, private patrimoinesService: PatrimoinesService,
        private toastrService: ToastrService, private loadingBarService: LoadingBarService,
        private stateWhiteSimCardService: StateWhiteSimCardService, private location: Location,) { }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[1];
        });
        this.getParamsInUrl();
    }

    private getParamsInUrl(): void {
        this.activatedRoute.queryParams.subscribe((params: Object) => {
            this.urlParamRef = params?.["ref"];
            this.urlParamCurrentPage = params?.["urlParamCurrentPage"];
            this.urlParamFilter = this.stateWhiteSimCardService.getFilterWhiteSimCardState(params?.["filter"]);
        });
        const idParam = this.activatedRoute.snapshot.paramMap.get('id');
        // on vérifie si idParam est défini et s'il peut être converti en un nombre valide avec !isNaN(Number(idParam)).
        this.urlParamId = idParam !== null && !isNaN(Number(idParam)) ? Number(idParam) : null;

        if (!isTypeView(this.urlParamRef) || !this.urlParamId) {
            this.displayUrlErrorPage = true;
        } else {
            if(this.urlParamId)  this.pageCallback(this.urlParamFilter, this.urlParamCurrentPage);
        }
        // recupere par default avec le msisdn du filtre du parent (supprimer seulement ci-dessous si l'on ne veut plus filtrer par default avec le msisdn du filtre du parent)
        this.filterData = {imsi :this.urlParamFilter?.["imsi"], iccid :this.urlParamFilter?.["iccid"]};
    }

    async pageCallback(urlParamFilter: Object = {}, urlParamCurrentPage: string = "1") {
        const response: WhiteSimCardPaginatedResponse|null = await handle<WhiteSimCardPaginatedResponse>(() => this.patrimoinesService.PostPatrimoineSimCartonSimBlancheAllPage(urlParamFilter, urlParamCurrentPage), this.toastrService, this.loadingBarService);
        if(response && response?.error === false) this.handleSuccessfulPageCallback(response);
    }

    private handleSuccessfulPageCallback(response: Object): void {
        this.listWhiteSimCard = response?.["data"]?.data?.data;
        this.getWhiteSimCardSelected(this.listWhiteSimCard)
    }

    private getWhiteSimCardSelected(listWhiteSimCard: Array<DossierWhiteSimCard>): void {
        this.selectedWhiteSimCard = listWhiteSimCard.find((carteSim: DossierWhiteSimCard) => carteSim?.["id"] == this.urlParamId);
        if(this.selectedWhiteSimCard) {
            this.postPatrimoineDetailsWhiteSimCard();
        } else {
            this.displayUrlErrorPage = true;
        }
    }

    async postPatrimoineDetailsWhiteSimCard(dataToSend: Object = this.filterData, nbrPage: number = 1) {
        const response: WhiteSimCardDetailsResponse|null = await handle<WhiteSimCardDetailsResponse>(() => this.patrimoinesService.PostPatrimoineSimCartonSimBlancheDetailsPage({...dataToSend, id: this.selectedWhiteSimCard?.["id"]}, nbrPage), this.toastrService, this.loadingBarService);
        if(response && response.error === false) this.handleSuccessfulPostPatrimoineDetailsWhiteSimCard(response);
    }

    private handleSuccessfulPostPatrimoineDetailsWhiteSimCard(response: any): void {
        this.listWhiteSimCardDetails = response.data?.carte_sims;
        this.spinner = false;
        this.stateWhiteSimCardService.setCurrentPageWhiteSimCardState(this.urlParamCurrentPage);
        this.stateWhiteSimCardService.setFilterWhiteSimCardState(this.urlParamFilter);
        this.stateWhiteSimCardService.setItemSelectedState(this.selectedWhiteSimCard);
    }

    public filter(filterData: Object): void {
        this.filterData = filterData;
        this.postPatrimoineDetailsWhiteSimCard(filterData);
    }

    public onGoToBack(): void {
        this.location.back();
    }

}