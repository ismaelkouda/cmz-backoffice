import { UsageInterface } from '../../../../../shared/interfaces/usage.interface';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from "@angular/core";
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { combineLatest, Observable } from 'rxjs';
import { TypeAlarme } from '../../../../../shared/enum/TypeAlarme.enum';
import { FormulasInterface } from '../../../../../shared/interfaces/formulas.interface';
import { SharedService } from '../../../../../shared/services/shared.service';
import { FirstLevelInterface } from '../../../../../shared/interfaces/first-level.interface';
import { ThirdLevelInterface } from '../../../../../shared/interfaces/third-level.interface';
import { dataBalanceStatusFilterInterface } from '../../data-access/data-balance-status/interfaces/data-balance-status-filter.interface';
import { ApnInterface } from '../../../../../shared/interfaces/apn.interface';
import { dataBalanceStatusInterface } from '../../data-access/data-balance-status/interfaces/data-balance-status.interface';
import { dataBalanceStatusApiService } from '../../data-access/data-balance-status/services/data-balance-status-api.service';

@Component({
    selector: "app-data-balance-status",
    templateUrl: "./data-balance-status.component.html",
    styleUrls: [`./data-balance-status.component.scss`]
})

export class DataBalanceStatusComponent implements OnInit {

    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<dataBalanceStatusInterface>>;
    public filterData: dataBalanceStatusFilterInterface;
    public listDataBalanceStatus$: Observable<Array<dataBalanceStatusInterface>>;
    public listUsages$: Observable<Array<UsageInterface>>;
    public listApn$: Observable<Array<ApnInterface>>;
    public listFormulas$: Observable<Array<FormulasInterface>>;
    public listFirstLevel$: Observable<Array<FirstLevelInterface>>;
    public listThirdLevel$: Observable<Array<ThirdLevelInterface>>;
    public listAlarms: Array<TypeAlarme> = [];
    public spinner: boolean = true;

    constructor(private activatedRoute: ActivatedRoute, private sharedService: SharedService, 
        private dataBalanceStatusApiService: dataBalanceStatusApiService) {
        Object.values(TypeAlarme).forEach(item => { this.listAlarms.push(item); });
    }

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[2];
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
        this.listDataBalanceStatus$ = this.dataBalanceStatusApiService.getDataBalanceStatus();
        this.pagination$ = this.dataBalanceStatusApiService.getDataBalanceStatusPagination();
        // combineLatest([
        //     this.dataBalanceStatusApiService.getDataFilterDataBalanceStatus(),
        //     this.dataBalanceStatusApiService.getDataNbrPageDataBalanceStatus()
        // ]).subscribe(([filterData, nbrPageData]) => {
        //     this.dataBalanceStatusApiService.fetchDataBalanceStatus(filterData, nbrPageData);
        // });
        this.dataBalanceStatusApiService.isLoadingDataBalanceStatus().subscribe((spinner) => {
            this.spinner = spinner;
        })
    }

    public filter(filterData: dataBalanceStatusFilterInterface): void {
        this.filterData = filterData;
        this.dataBalanceStatusApiService.fetchDataBalanceStatus(filterData)
    }

    public onPageChange(event: number): void {
        this.dataBalanceStatusApiService.fetchDataBalanceStatus(this.filterData, JSON.stringify(event + 1))
    }

}