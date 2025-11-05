import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { combineLatest, Observable, Subject, takeUntil } from 'rxjs';
import { BreadcrumbComponent } from '../../../../../shared/components/breadcrumb/breadcrumb.component';
import { ParginationComponent } from '../../../../../shared/components/pargination/pargination.component';
import { PatrimoineHeaderComponent } from '../../../../../shared/components/patrimoine-header/patrimoine-header.component';
import {
    LIST_REQUESTS_SERVICE,
    T_LIST_REQUESTS_SERVICE,
} from '../../../../../shared/enum/list-requests-service';
import { ApplicantInterface } from '../../../../../shared/interfaces/applicant';
import { Paginate } from '../../../../../shared/interfaces/paginate';
import { WaitingQueueInterface } from '../../../../../shared/interfaces/waiting-queue.interface';
import {
    T_WAITING_QUEUE_STATE_ENUM,
    WAITING_QUEUE_STATE_ENUM,
} from '../../data-access/waiting-queue/enums/waiting-queue-state.enum';
import {
    T_WAITING_QUEUE_STEP_ENUM,
    WAITING_QUEUE_STEP_ENUM,
} from '../../data-access/waiting-queue/enums/waiting-queue-step.enum';
import { WaitingQueueFilterInterface } from '../../data-access/waiting-queue/interfaces/waiting-queue-filter.interface';
import { WaitingQueueApiService } from '../../data-access/waiting-queue/services/waiting-queue-api.service';
import { FilterWaitingQueueComponent } from '../../feature/waiting-queue/filter-waiting-queue/filter-waiting-queue.component';
import { TableWaitingQueueComponent } from '../../feature/waiting-queue/table-waiting-queue/table-waiting-queue.component';
import { SharedService } from './../../../../../shared/services/shared.service';

@Component({
    selector: 'app-waiting-queue',
    standalone: true,
    templateUrl: './waiting-queue.component.html',
    imports: [
        CommonModule,
        BreadcrumbComponent,
        FilterWaitingQueueComponent,
        TableWaitingQueueComponent,
        PatrimoineHeaderComponent,
        ParginationComponent,
        TranslateModule
    ],
})
export class WaitingQueueComponent implements OnInit {
    public module!: string;
    public subModule!: string;
    public pagination$!: Observable<Paginate<WaitingQueueInterface>>;
    public listWaitingQueue$!: Observable<Array<WaitingQueueInterface>>;
    public spinner: boolean = true;
    private destroy$ = new Subject<void>();
    public listWaitingQueueStep: Array<T_WAITING_QUEUE_STEP_ENUM> =
        Object.values(WAITING_QUEUE_STEP_ENUM);
    public listWaitingQueueState: Array<T_WAITING_QUEUE_STATE_ENUM> =
        Object.values(WAITING_QUEUE_STATE_ENUM);

    public listOperations: Array<T_LIST_REQUESTS_SERVICE> = Object.values(
        LIST_REQUESTS_SERVICE
    );
    public listApplicants$!: Observable<Array<ApplicantInterface>>;

    constructor(
        private sharedService: SharedService,
        private activatedRoute: ActivatedRoute,
        private waitingQueueApiService: WaitingQueueApiService
    ) {}

    ngOnInit(): void {
        this.activatedRoute.data.subscribe((data) => {
            this.module = data['module'];
            this.subModule = data['subModule'][0];
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
