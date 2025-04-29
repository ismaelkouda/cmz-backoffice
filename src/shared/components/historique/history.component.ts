import { Component, Input, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { HistoryApiService } from './data-access/services/history-api.service';
import { SharedService } from '../../services/shared.service';
import { Paginate } from '@shared/interfaces/paginate';
import { historyInterface } from './data-access/interfaces/history.interface';
import { historyFilterInterface } from './data-access/interfaces/history-filter.interface';
import { ApplicantInterface } from '@shared/interfaces/applicant';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    @Input() idModel: number;
    @Input() typeModel: string;
    public listHistory$: Observable<Array<any>>;
    public pagination$: Observable<Paginate<historyInterface>>;
    public historySelected$: Observable<any>;
    public listApplicants$: Observable<Array<ApplicantInterface>>;

    constructor(
        private historyApiService: HistoryApiService,
        private sharedService: SharedService
    ) {}

    ngOnInit(): void {
        this.listHistory$ = this.historyApiService.getHistory();
        this.pagination$ = this.historyApiService.getHistoryPagination();
        this.historySelected$ = this.historyApiService.getHistorySelected();
        // combineLatest([
        //     this.historyApiService.getDataFilterHistory(),
        //     this.historyApiService.getDataNbrPageHistory(),
        // ]).subscribe(([filterData, nbrPageData]) => {
        //     const dataToSend = {
        //         ...filterData,
        //         idModel: this.idModel,
        //         typeModel: this.typeModel,
        //     };
        //     this.historyApiService.fetchHistory(dataToSend, nbrPageData);
        // });
        this.historyApiService.fetchHistory({} as historyFilterInterface);
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
    }

    public filter(filterData: historyFilterInterface): void {
        this.historyApiService.fetchHistory(filterData);
    }

    public onPageChange(event: number): void {
        this.historyApiService
            .getDataFilterHistory()
            .subscribe((filterData) => {
                this.historyApiService.fetchHistory(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }
}
