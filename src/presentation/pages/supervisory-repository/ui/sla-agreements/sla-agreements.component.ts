import { SlaAgreementsApiService } from '../../data-access/sla-agreements/services/sla-agreements-api.service';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { slaAgreementsInterface } from '../../data-access/sla-agreements/interfaces/sla-agreements.interface';

@Component({
    selector: 'app-sla-agreements',
    templateUrl: './sla-agreements.component.html'
})

export class SlaAgreementsComponent implements OnInit {
    public module: string;
    public subModule: string;
    public listSlaAgreements$: Observable<Array<slaAgreementsInterface>>;
    public detailsCurrentTabPanelIndex: number = 0;
    
    constructor(private activatedRoute: ActivatedRoute,
        private slaAgreementssApiService: SlaAgreementsApiService) {
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
        });
        this.listSlaAgreements$ = this.slaAgreementssApiService.getSlaAgreements();
        this.slaAgreementssApiService.fetchSlaAgreements();
    }

}
