import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { SlaAgreementsInterface } from '../../data-access/sla-agreements/interfaces/sla-agreements.interface';
import { SlaAgreementsApiService } from '../../data-access/sla-agreements/services/sla-agreements-api.service';

@Component({
    selector: 'app-sla-agreements',
    templateUrl: './sla-agreements.component.html',
})
export class SlaAgreementsComponent implements OnInit, OnDestroy {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<SlaAgreementsInterface>>;
    public listSlaAgreements$: Observable<SlaAgreementsInterface[]>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(
        private activatedRoute: ActivatedRoute,
        private slaAgreementsApiService: SlaAgreementsApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.listSlaAgreements$ =
            this.slaAgreementsApiService.getSlaAgreements();
        this.slaAgreementsApiService.fetchSlaAgreements();
        this.slaAgreementsApiService
            .isLoadingSlaAgreements()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
