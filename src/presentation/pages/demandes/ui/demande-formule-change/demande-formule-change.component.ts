import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SettingService } from 'src/shared/services/setting.service';
import { ActivatedRoute } from '@angular/router';
import { PatrimoineService } from 'src/presentation/pages/patrimoine/data-access/patrimoine.service';
import { OperationTransaction } from 'src/shared/enum/OperationTransaction.enum';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-demande-formule-change',
    templateUrl: './demande-formule-change.component.html',
    styleUrls: ['./demande-formule-change.component.scss'],
})
export class DemandeFormuleChangeComponent implements OnInit {
    public module: string;
    public subModule: string;
    public listStatuts: Array<any> = [];
    public listTransactions: Array<any> = [];
    public initialView: boolean = true;
    public formsView: boolean = false;
    public transactionId: string;
    public showView: boolean = false;
    public currentObject: any;
    public typeDemande: string = 'simple';
    public currentOperation: string = OperationTransaction.CHANGEMENT_FORMULE;
    public title =
        'Demande Changement Formule - Système de Gestion de Collecte Centralisée';
    constructor(
        public settingService: SettingService,
        public patrimoineService: PatrimoineService,
        public toastrService: ToastrService,
        private route: ActivatedRoute,
        private titleService: Title
    ) {
        this.titleService.setTitle(`${this.title}`);
    }

    ngOnInit() {
        this.route.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[3];
        });
        if (history.state.patrimoine) {
        }
    }
    public pushStatutView(event: boolean): void {
        this.formsView = event;
        this.initialView = !event;
    }
    public pushStatutShowView(event: boolean): void {
        this.showView = event;
        this.initialView = !event;
        this.formsView = event;
    }
    public pushTransactionId(event: string): void {
        if (event) {
            this.transactionId = event;
            this.showView = true;
            this.initialView = false;
            this.formsView = false;
        }
    }
    public pushListTransactions(event: any): void {
        this.listTransactions = event;
    }
}
