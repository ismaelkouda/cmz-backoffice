import { SWALWITHBOOTSTRAPBUTTONSPARAMS } from './../../../../../../shared/constants/swalWithBootstrapButtonsParams.constant';

import { PatrimoinesService } from "src/presentation/pages/patrimoine/data-access/patrimoines.service";
import { CarteSimStateService } from 'src/presentation/pages/patrimoine/data-access/carte-sim/carte-sim-state.service';
import { handle } from 'src/shared/functions/api.function';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from "ngx-toastr";
import { LoadingBarService } from "@ngx-loading-bar/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MappingService } from "src/shared/services/mapping.service";
import { ApplicationType } from "src/shared/enum/ApplicationType.enum";
import { CARTES_SIM } from "src/presentation/pages/patrimoine/patrimoine-routing.module";
import { PATRIMOINE } from "src/shared/routes/routes";
import { DEMANDE_SERVICE } from 'src/shared/routes/routes';
import { DEMANDE_ACTIVATION } from 'src/presentation/pages/demandes/demandes-routing.module';
const Swal = require('sweetalert2');

@Component({
    selector: 'app-carte-sim-form',
    templateUrl: './carte-sim-form.component.html',
    styles: [`
        .small-dashboard {
    display: flex;
    gap: 2rem;
}

.label {
    font-size: 20px;
    color: #000;
    text-align: center;
}

.box-card {
    text-align: center;
    border: 2px solid #2c3e50;
    border-radius: 6px;
    height: 80px !important;
    width: 384px !important;
    .title {
        span {
            color: black;
            text-transform: capitalize;
            font-weight: 900 !important;
            font-size: 35px;
        }
    }
    .valeur {
        span {
            color: #ff6600;
            font-size: 45px;
            text-align: center;
            font-weight: 900 !important;
        }
    }
}
        `]
})

export class CarteSimFormComponent implements OnInit {
    public spinner: boolean;
    public listCartesSim: Array<Object>;
    public listExploitations: Array<Object>;
    public listDR: Array<Object>;
    public listUsage: Array<Object>;
    public listActivites: Array<Object>;
    public carteSimSelected: Object | void;
    private response: any;
    public carteSimForm: FormGroup;
    public currentTabsIndex: number = 0;
    public carteSimSelectedDetails: Object;
    public applicationType: string;
    public patrimoineType: string;
    public carteSimSelectedId: string;
    public currentView: 'details' | 'editer';
    public numberCurrentPage: string;
    public module: string;
    public subModule: string;
    public firstLevelLibelle: string;
    public secondLevelLibelle: string;
    public thirdLevelLibelle: string;

    constructor(private activatedRoute: ActivatedRoute, private patrimoinesService: PatrimoinesService,
        private loadingBar: LoadingBarService, private toastrService: ToastrService,
        private carteSimStateService: CarteSimStateService, private fb: FormBuilder,
        public mappingService: MappingService, private router: Router) {
        this.firstLevelLibelle = this.mappingService.structureGlobale?.niveau_1;
        this.secondLevelLibelle = this.mappingService.structureGlobale?.niveau_2;
        this.thirdLevelLibelle = this.mappingService.structureGlobale?.niveau_3;
        this.applicationType = this.mappingService.applicationType;
        this.patrimoineType = ApplicationType.PATRIMOINESIM;
    }

    ngOnInit(): void {
        this.spinner = true;
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.initCarteSimForm();
        this.getUrlParams();
    }
    private initCarteSimForm(): void {
        this.carteSimForm = this.fb.group({
            direction_regionale: [null, [Validators.required]],
            exploitation: [null],
            zone: [null, [Validators.required]],
            usage: [null, [Validators.required]],
            point_emplacement: [null],
            adresse_geographique: [null],
            longitude: [null],
            latitude: [null],
            adresse_email: [null, [Validators.email]],
            formule: [null],
            imsi: [null],
            statut: [null],
            msisdn: [null],
            date_id_reseau: [null],
            apn: [null],
            site_reseau: [null],
            adresse_ip: [null]
        });
    }
    public getUrlParams(): void {
        this.activatedRoute.queryParams.subscribe((params: any) => {
            this.currentView = params?.view;
            this.carteSimSelectedId = params['id'];
            this.numberCurrentPage = params?.currentPage;
        });
        this.pageCallback(this.carteSimStateService.getFilterState(), +this.numberCurrentPage);
        this.selectedTypeInterface(this.currentView)
    }

    private selectedTypeInterface(currentView: 'details' | 'editer') {
        switch (currentView) {
            case 'editer':
                this.carteSimForm.get('direction_regionale')?.valueChanges.subscribe(this.getAllExploitation.bind(this));
                this.getAllDR();
                this.getAllUsages();
                this.getAllZones();
            break;
        }
    }

    async getAllExploitation(selectedDRId: number) {
        this.response = await handle(() => this.patrimoinesService.PostParametresSecuriteNiveauDeuxSimple({ niveau_un_uuid: selectedDRId }), this.toastrService, this.loadingBar);
        if (this.response) this.listExploitations = this.response.data;
    }

    async getAllDR(): Promise<void> {
        this.response = await handle(() => this.patrimoinesService.PostParametresSecuriteNiveauUnSimple({}), this.toastrService, this.loadingBar);
        if (this.response) this.listDR = this.response.data;
    }

    async getAllUsages(): Promise<void> {
        this.response = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsAllUsages({}), this.toastrService, this.loadingBar);
        if (this.response) this.listUsage = this.response.data;
    }

    async getAllZones(): Promise<void> {
        this.response = await handle(() => this.patrimoinesService.PostParametresSecuriteNiveauTroisSimple({}), this.toastrService, this.loadingBar);
        if (this.response) this.listActivites = this.response.data;
    }

    async pageCallback(dataToSend: Object = {}, nbrPage: number = 1) {
        this.response = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsAllPage(dataToSend, nbrPage), this.toastrService, this.loadingBar);
        if (this.response) this.handleSuccessfulPageCallBack(this.response);
    }
    private handleSuccessfulPageCallBack(response: any): void {
        this.listCartesSim = response.data?.data;
        if (this.listCartesSim) this.getCarteSimSelected(this.listCartesSim);
    }
    private getCarteSimSelected(listCartesSim: Array<Object>): void {
        this.carteSimSelected = listCartesSim.find((e) => e['id'] == this.carteSimSelectedId)
        if (this.carteSimSelected) this.getCarteSimSelectedDetails(this.carteSimSelected['imsi']);
    }
    async getCarteSimSelectedDetails(carteSimSelectedImsi: string): Promise<any> {
        this.response = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsimsiDetails(carteSimSelectedImsi), this.toastrService, this.loadingBar);
        if (this.response) {
            this.carteSimSelectedDetails = this.response.data;
            this.spinner = false;
            console.log('this.carteSimSelectedDetails', this.carteSimSelectedDetails)
            this.patchValueCarteSimForm(this.response.data)
        };
    }
    private patchValueCarteSimForm(carteSimSelectedDetails: any): void {
        const getViewValue = (detailsValue: any, uuidValue: any) => {
            return this.currentView === 'details' ? detailsValue : uuidValue;
        };

        if (this.currentView === 'details') this.carteSimForm.disable();
    
        this.carteSimForm.patchValue({
            direction_regionale: getViewValue(carteSimSelectedDetails?.niveau_uns_nom, carteSimSelectedDetails?.niveau_un_uuid),
            exploitation: getViewValue(carteSimSelectedDetails?.niveau_deux_nom, carteSimSelectedDetails?.niveau_deux_uuid),
            zone: getViewValue(carteSimSelectedDetails?.niveau_trois_nom, carteSimSelectedDetails?.niveau_trois_uuid),
            usage: getViewValue(carteSimSelectedDetails?.nom_usage, carteSimSelectedDetails?.usage?.id),
            imsi: carteSimSelectedDetails?.imsi,
            msisdn: carteSimSelectedDetails?.msisdn,
            statut: carteSimSelectedDetails?.statut,
            adresse_geographique: carteSimSelectedDetails?.adresse_geographique,
            point_emplacement: carteSimSelectedDetails?.point_emplacement,
            adresse_email: carteSimSelectedDetails?.adresse_email,
            longitude: carteSimSelectedDetails?.longitude,
            latitude: carteSimSelectedDetails?.latitude,
            formule: carteSimSelectedDetails?.formule,
            date_id_reseau: carteSimSelectedDetails?.date_id_reseau,
            apn: carteSimSelectedDetails?.apn,
            site_reseau: carteSimSelectedDetails?.site_reseau,
            adresse_ip: carteSimSelectedDetails?.adresse_ip,
        });
        this.carteSimForm.get('imsi').disable();
        this.carteSimForm.get('msisdn').disable();
        this.carteSimForm.get('statut').disable();
        this.carteSimForm.get('formule').disable();
        this.carteSimForm.get('date_id_reseau').disable();
        this.carteSimForm.get('apn').disable();
        this.carteSimForm.get('site_reseau').disable();
        this.carteSimForm.get('adresse_ip').disable();
    }

    public getFormattedMsisdn(value: Object): string {
        this.carteSimSelectedDetails
        console.log('this.carteSimSelectedDetails', this.carteSimSelectedDetails)
        console.log('value', value)
        if(value['msisdn']) {
            const msisdn = value['msisdn']; // Assurez-vous que msisdn est défini
            const formattedMsisdn = msisdn.replace(/(\d{2})(?=\d)/g, "$1 "); // Ajoute le séparateur
            return formattedMsisdn;
        }
    }

    public onTransactionForm(data: any, operation: string): void {
        this.router.navigateByUrl(
          `${DEMANDE_SERVICE}/${DEMANDE_ACTIVATION}`,
          { state: {patrimoine: data,operation: operation} }
        );
    }
    public handleChangeTabviewIndex(e) {
        this.currentTabsIndex = e.index;
    }

    async onUpdateCarteSim(): Promise<any> {
        const dataToSend = {
            ...this.carteSimForm.value,
            sim_id: this.carteSimSelectedDetails['id'],
            niveau_un_uuid: this.carteSimForm.get('direction_regionale').value,
            niveau_deux_uuid: this.carteSimForm.get('exploitation').value,
            niveau_trois_uuid: this.carteSimForm.get('zone').value,
            usage_id: this.carteSimForm.get('usage').value,
          }
        this.response = await handle(() => this.patrimoinesService.PostPatrimoineSimSimsUpdate(dataToSend), this.toastrService, this.loadingBar);
        if (this.response) this.handleSuccessfulUpdateCarteSim(this.response);
    }

    private handleSuccessfulUpdateCarteSim(response: any): void {
        this.toastrService.success(response.message);
    }

    public onCloseView(): void {
        this.router.navigate([PATRIMOINE + "/" + CARTES_SIM])
    }

    public handleRefreshData(data: Object): void {
        const htmlMessage = `Voulez-vous rafraîchir le solde Data ?`;
        Swal.fire({...SWALWITHBOOTSTRAPBUTTONSPARAMS.message, html: htmlMessage}).then((result) => {
          if (result.isConfirmed) {
            handle(() => this.patrimoinesService.PostPatrimoineSimEtatsDesSoldesActualisationSimple({msisdn: data['msisdn']}), this.toastrService, this.loadingBar)
            .then((response: any) => {
                this.toastrService.success(response.message);
                this.onCloseView();
              });
          }
        });
    }
}