import { Component, Input, OnInit } from '@angular/core';
import { LoadingBarService } from '@ngx-loading-bar/core';
import { ToastrService } from 'ngx-toastr';
import { handle } from 'src/shared/functions/api.function';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ExcelService } from '@shared/services/excel.service';
import { SettingService } from '../../services/setting.service';
import { SharedService } from '../../services/shared.service';
import { map, Observable } from 'rxjs';
import {
    DetailsHistoryData,
    DetailsHistoryDataChange,
} from './data-access/interfaces/details-historique.interface';
import { Paginate } from '../../interfaces/paginate';
import { HistoryApiService } from './data-access/services/history-api.service';

@Component({
    selector: 'app-historique',
    templateUrl: './historique.component.html',
    styleUrls: ['./historique.component.scss'],
})
export class HistoriqueComponent implements OnInit {
    public formFilter: FormGroup;
    @Input() idModel: number;
    @Input() typeModel: string;
    @Input() module: string;
    @Input() sous_module: string;
    @Input() modele: string;
    @Input() modele_id: any;
    @Input() modele_type: any;

    public listUsers: Array<any>;
    public exportList: Array<any>;
    public listHistoriques: Array<any>;

    public filterDateEnd: Date;
    public selectDateEnd: any;

    public currentEventParseBeforeKeys: Array<any> = [];
    public currentEventParseBeforeValues: Array<any> = [];
    public currentEventParseAfterValues: Array<any> = [];
    public currentEventParseAfter: Array<any> = [];
    // public filterDateStart: Date;
    // public selectDateStart: any;
    public currentEvent: any;
    public currentEventParse;
    public display: boolean = false;
    public isMaximized: boolean = false;
    private response: any;
    public listHistory$: Observable<Array<any>>;
    public detailsHistory$: Observable<Array<DetailsHistoryData>>;
    public historyPagination$: Observable<Paginate<any>>;
    public historySelected$: Observable<any>;
    transformedData$: Observable<DetailsHistoryDataChange[]>;

    constructor(
        private loadingBar: LoadingBarService,
        private toastrService: ToastrService,
        private settingService: SettingService,
        private fb: FormBuilder,
        private excelService: ExcelService,
        private sharedService: SharedService,
        private historyApiService: HistoryApiService
    ) {}

    ngOnInit(): void {
        this.initFormFilter();
        this.getAllUsers();
        // this.pageCallback();
        this.listHistory$ = this.historyApiService.getHistory();
        this.historyPagination$ = this.historyApiService.getHistoryPagination();
        this.historySelected$ = this.historyApiService.getHistorySelected();
        this.historyApiService.fetchHistory({
            idModel: this.idModel,
            typeModel: this.typeModel,
            ...this.formFilter.value,
        });
        // this.detailsHistory$ = this.historyApiService.getDetailsHistory();
        // this.transformedData$ = this.detailsHistory$.pipe(
        //   map((event: any) =>
        //     event?.data.map((item) => ({
        //       key: item.key,
        //       previousValue: item.value ?? '',
        //       currentValue: item.value ?? ''
        //     })) || []
        //   )
        // );
    }
    private initFormFilter() {
        this.formFilter = this.fb.group({
            date_debut: [''],
            date_fin: [''],
            user_id: [],
        });
    }
    async getAllUsers(dataToSend: Object = {}): Promise<any> {
        this.response = await handle(
            () => this.settingService.getAllUsers(dataToSend),
            this.toastrService,
            this.loadingBar
        );
        this.listUsers = this.response?.data.map((user: any) => {
            return {
                ...user,
                fullName: `[${user.matricule}] ${user.nom} ${user.prenoms}`,
            };
        });
    }
    async pageCallback(nbrPage: string = '1') {
        // const dataToSend = {module: this.module,sous_module: this.sous_module,modele: this.modele,modele_id: this.modele_id,...this.formFilter.value};
        const dataToSend = {
            idModel: this.idModel,
            typeModel: this.typeModel,
            ...this.formFilter.value,
        };
        this.response = await handle(
            () => this.settingService.getHistoriques(dataToSend, nbrPage),
            this.toastrService,
            this.loadingBar
        );
        if (this.response?.data) this.handleGetAllHistoriques(this.response);
    }

    private handleGetAllHistoriques(response: any): void {
        this.listHistoriques = response?.data?.data;
        // this.exportList = response?.data.map((el) => { return { SourceUtilisteur: el.ip + "[" + el.nom + " " + el.prenoms + "]", Module: el.module, sousModule: el.sous_module, action: el.action, date: el.created_at}});
    }

    public OnExportExcel(): void {
        // const listHistory = this.listHistory$.pipe(
        //   map(event =>
        //   event?.data.map((item) => ({
        //     key: item.key,
        //     previousValue: item.value ?? '',
        //     currentValue: item.value ?? ''
        //   })) || []
        // ))
        const data = this.listHistoriques.map(
            (historique) =>
                ({
                    Date: historique?.created_at,
                    Operation: historique?.event,
                    'Détails Operation': historique?.action,
                    'Source [Utilisateur]': `${historique?.ip} ${historique?.user} ${historique?.user?.nom} ${historique?.user?.prenoms}`,
                } as const)
        );
        this.excelService.exportAsExcelFile(
            data,
            'Liste des historique Account Managers'
        );
    }

    showHistorique(historique: any) {
        // if (historique?.event === "Mise à jour" || historique?.event === "Évènement") {
        //   this.currentEventParse = JSON.parse(historique?.data);
        //   if (this.currentEventParse?.before && this.currentEventParse?.after) {
        //     Object.values(this.currentEventParse.before).map((value: any, i) => {
        //         this.currentEventParseBeforeValues.push(value);
        //       this.currentEventParseBeforeKeys.push(
        //         Object.keys(this.currentEventParse.before)[i]
        //       );
        //       this.currentEventParseAfter.push(
        //         Object.values(this.currentEventParse.after)[i]
        //       );
        //       this.currentEventParseAfterValues = this.currentEventParseAfter.map(
        //         (item, index) => {
        //           if(item && typeof(item) === 'object') {
        //             if (item.id === this.currentEventParseBeforeValues[index].id) {
        //               return { item, isIdentique: true };
        //             } else {
        //               return { item, isIdentique: false };
        //             }
        //           } else {
        //             if (item === this.currentEventParseBeforeValues[index]) {
        //               return { item, isIdentique: true };
        //             } else {
        //               return { item, isIdentique: false };
        //             }
        //           }
        //         }
        //       );
        //     });
        //   }
        // }
        this.display = true;
        this.currentEvent = historique;
        this.getDetailsHistoriques();
    }

    async getDetailsHistoriques(): Promise<void> {
        const dataToSend = [{ typeModel: this.typeModel }];
        this.historyApiService.fetchDetailsHistory(this.idModel, dataToSend);
    }

    public onDialogMaximized(event) {
        event.maximized
            ? (this.isMaximized = true)
            : (this.isMaximized = false);
    }

    hideDialog() {
        this.display = false;
    }
    // refreshHistorique() {
    //   this.settingService.statutSubject$.subscribe((response: any) => {
    //     if (response === true) {
    //       this.getAllHistoriques();
    //     }
    //   });
    // }

    // changeDateStart(e) {
    //   // this.selectDateStart = moment(this.filterDateStart).format("YYYY-MM-DD");
    // }
    // changeDateEnd(e) {
    //   // this.selectDateEnd = moment(this.filterDateEnd).format("YYYY-MM-DD");
    // }

    // filterHistoriques() {
    //   if (moment(this.formFilter.get('date_debut').value).isAfter(moment(this.formFilter.get('date_fin').value))) {
    //     this.toastService.error("Plage de date invalide");
    //     return;
    //   }
    //   this.getAllHistoriques();
    // }
}
