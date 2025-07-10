import { ApplicantInterface } from '../../interfaces/applicant';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryApiService } from './data-access/services/history-api.service';
import { SharedService } from '../../services/shared.service';
import { historyInterface } from './data-access/interfaces/history.interface';
import { historyFilterInterface } from './data-access/interfaces/history-filter.interface';
import { Paginate } from '../../interfaces/paginate';

@Component({
    selector: 'app-history',
    templateUrl: './history.component.html',
})
export class HistoryComponent implements OnInit {
    @Input() module: string;
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
        const dataToSend = {
            typeModel: this.typeModel,
            idModel: this.idModel,
            module: this.module,
        } as historyFilterInterface;
        this.historyApiService.fetchHistory(dataToSend, '1');
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
    }

    public filter(filterData: historyFilterInterface): void {
        this.historyApiService.fetchHistory({
            ...filterData,
            typeModel: this.typeModel,
            idModel: this.idModel,
            module: this.module,
        });
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
