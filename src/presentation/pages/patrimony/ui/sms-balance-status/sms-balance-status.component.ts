import { UsageInterface } from './../../../../../shared/interfaces/usage.interface';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { TypeAlarme } from '../../../../../shared/enum/TypeAlarme.enum';
import { FormulasInterface } from '../../../../../shared/interfaces/formulas.interface';
import { SharedService } from '../../../../../shared/services/shared.service';
import { smsBalanceStatusApiService } from '../../data-access/sms-balance-status/services/sms-balance-status-api.service';
import { FirstLevelInterface } from '../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../shared/interfaces/third-level.interface';
import { smsBalanceStatusInterface } from '../../data-access/sms-balance-status/interfaces/sms-balance-status.interface';
import { smsBalanceStatusFilterInterface } from '../../data-access/sms-balance-status/interfaces/sms-balance-status-filter.interface';
import { ApnInterface } from '../../../../../shared/interfaces/apn.interface';

@Component({
    selector: "app-sms-balance-status",
    templateUrl: "./sms-balance-status.component.html",
    styleUrls: [`./sms-balance-status.component.scss`]
})

export class SmsBalanceStatusComponent implements OnInit, OnDestroy {

    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<smsBalanceStatusInterface>>;
    public listSmsBalanceStatus$: Observable<Array<smsBalanceStatusInterface>>;
    public listUsages$: Observable<Array<UsageInterface>>;
    public listApn$: Observable<Array<ApnInterface>>;
    public listFormulas$: Observable<Array<FormulasInterface>>;
    public listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    public listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    public listAlarms: Array<TypeAlarme> = [];
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();

    constructor(private activatedRoute: ActivatedRoute, private sharedService: SharedService,
        private smsBalanceStatusApiService: smsBalanceStatusApiService) {
        Object.values(TypeAlarme).forEach(item => { this.listAlarms.push(item); });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[3];
        });
        this.sharedService.fetchUsages();
        this.listUsages$ = this.sharedService.getUsages();
        this.sharedService.fetchFormulas();
        this.listFormulas$ = this.sharedService.getFormulas();
        this.sharedService.fetchApn();
        this.listApn$ = this.sharedService.getApn();
        this.sharedService.fetchFirstLevel();
        this.listFirstLevel$ = this.sharedService.getFirstLevel();;
        this.sharedService.fetchThirdLevel();
        this.listThirdLevel$ = this.sharedService.getThirdLevel();
        this.listSmsBalanceStatus$ = this.smsBalanceStatusApiService.getSmsBalanceStatus();
        this.pagination$ = this.smsBalanceStatusApiService.getSmsBalanceStatusPagination();
        // combineLatest([
        //     this.smsBalanceStatusApiService.getDataFilterSmsBalanceStatus(),
        //     this.smsBalanceStatusApiService.getDataNbrPageSmsBalanceStatus()
        // ]).subscribe(([filterData, nbrPageData]) => {
        //     this.smsBalanceStatusApiService.fetchSmsBalanceStatus(filterData, nbrPageData);
        // });
        this.smsBalanceStatusApiService.isLoadingSmsBalanceStatus().subscribe((spinner) => {
            this.spinner = spinner;
        })
    }

    public filter(filterData: smsBalanceStatusFilterInterface): void {
        this.smsBalanceStatusApiService.fetchSmsBalanceStatus(filterData)
    }

    public onPageChange(event: number): void {
        this.smsBalanceStatusApiService.getDataFilterSmsBalanceStatus().pipe(takeUntil(this.destroy$)).subscribe((filterData) => {
            this.smsBalanceStatusApiService.fetchSmsBalanceStatus(filterData, JSON.stringify(event + 1))
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

}