import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { WaitingQueueApiService } from '../../data-access/waiting-queue/services/waiting-queue-api.service';
import { waitingQueueFilterInterface } from '../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { Folder } from '../../../../../shared/interfaces/folder';

@Component({
    selector: 'app-waiting-queue',
    templateUrl: './waiting-queue.component.html',
})
export class WaitingQueueComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<Folder>>;
    public filterData: waitingQueueFilterInterface;
    public listWaitingQueue$: Observable<Array<Folder>>;
    public waitingQueueSelected$: Observable<Folder>;
    public listOperations: Array<string> = [];
    public listApplicants$: Observable<any[]>;

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private waitingQueueApiService: WaitingQueueApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data.module;
            this.subModule = data.subModule[0];
        });
        this.sharedService.fetchApplicants();
        this.listApplicants$ = this.sharedService.getApplicants();
        this.listWaitingQueue$ = this.waitingQueueApiService.getWaitingQueue();
        this.pagination$ =
            this.waitingQueueApiService.getWaitingQueuePagination();
        this.waitingQueueSelected$ =
            this.waitingQueueApiService.getWaitingQueueSelected();

        combineLatest([
            this.waitingQueueApiService.getDataFilterWaitingQueue(),
            this.waitingQueueApiService.getDataNbrPageWaitingQueue(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.waitingQueueApiService.fetchWaitingQueue(
                filterData,
                nbrPageData
            );
        });
    }

    public filter(filterData: waitingQueueFilterInterface): void {
        this.filterData = filterData;
        this.waitingQueueApiService.fetchWaitingQueue(filterData);
    }

    public onPageChange(event: number): void {
        this.waitingQueueApiService.fetchWaitingQueue(
            this.filterData,
            JSON.stringify(event + 1)
        );
    }
}
