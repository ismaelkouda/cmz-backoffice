import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { QueuesEntity } from '@presentation/pages/report-requests/domain/entities/queues/queues.entity';
import { FetchQueuesUseCase } from '@presentation/pages/report-requests/domain/use-cases/queues.use-case';
import { QueuesFilter } from '@presentation/pages/report-requests/domain/value-objects/queues-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class QueuesFacade extends BaseFacade<QueuesEntity, QueuesFilter> {
    readonly queues$: Observable<QueuesEntity[]> = this.items$;

    constructor(
        private readonly fetchUseCase: FetchQueuesUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchQueues(
        filter: QueuesFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetchObservable = this.fetchUseCase.execute(filter, page);
        this.fetchData(filter, page, fetchObservable);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetchObservable = this.fetchUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetchObservable);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetchObservable = this.fetchUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetchObservable);
    }
}
