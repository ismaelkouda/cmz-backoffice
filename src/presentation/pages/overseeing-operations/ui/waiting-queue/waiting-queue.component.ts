import { SharedService } from './../../../../../shared/services/shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { WaitingQueueApiService } from '../../data-access/waiting-queue/services/waiting-queue-api.service';
import { WaitingQueueFilterInterface } from '../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { WaitingQueueInterface } from '../../../../../shared/interfaces/waiting-queue.interface';
import {
    T_WAITING_QUEUE_STEP_ENUM,
    WAITING_QUEUE_STEP_ENUM,
} from '../../data-access/waiting-queue/enums/waiting-queue-step.enum';
import {
    T_WAITING_QUEUE_STATE_ENUM,
    WAITING_QUEUE_STATE_ENUM,
} from '../../data-access/waiting-queue/enums/waiting-queue-state.enum';
import {
    LIST_REQUESTS_SERVICE,
    T_LIST_REQUESTS_SERVICE,
} from '../../../../../shared/enum/list-requests-service';
import { ApplicantInterface } from '../../../../../shared/interfaces/applicant';

@Component({
    selector: 'app-waiting-queue',
    templateUrl: './waiting-queue.component.html',
})
export class WaitingQueueComponent implements OnInit {
    public module: string;
    public subModule: string;
    public pagination$: Observable<Paginate<WaitingQueueInterface>>;
    public listWaitingQueue$: Observable<Array<WaitingQueueInterface>>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listWaitingQueueStep: Array<T_WAITING_QUEUE_STEP_ENUM> =
        Object.values(WAITING_QUEUE_STEP_ENUM);
    public listWaitingQueueState: Array<T_WAITING_QUEUE_STATE_ENUM> =
        Object.values(WAITING_QUEUE_STATE_ENUM);

    public listOperations: Array<T_LIST_REQUESTS_SERVICE> = Object.values(
        LIST_REQUESTS_SERVICE
    );
    public listApplicants$: Observable<Array<ApplicantInterface>>;

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

        combineLatest([
            this.waitingQueueApiService.getDataFilterWaitingQueue(),
            this.waitingQueueApiService.getDataNbrPageWaitingQueue(),
        ]).subscribe(([filterData, nbrPageData]) => {
            this.waitingQueueApiService.fetchWaitingQueue(
                filterData,
                nbrPageData
            );
        });
        this.waitingQueueApiService
            .isLoadingWaitingQueue()
            .subscribe((spinner) => {
                this.spinner = spinner;
            });
    }

    public filter(filterData: WaitingQueueFilterInterface): void {
        this.waitingQueueApiService.fetchWaitingQueue(filterData);
    }

    public onPageChange(event: number): void {
        this.waitingQueueApiService
            .getDataFilterWaitingQueue()
            .pipe(takeUntil(this.destroy$))
            .subscribe((filterData) => {
                this.waitingQueueApiService.fetchWaitingQueue(
                    filterData,
                    JSON.stringify(event + 1)
                );
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
