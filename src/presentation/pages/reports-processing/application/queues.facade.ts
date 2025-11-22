import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { QueuesEntity } from '../domain/entities/queues/queues.entity';
import { FetchQueuesUseCase } from '../domain/use-cases/queues.use-case';
import { QueuesFilter } from '../domain/value-objects/queues-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class QueuesFacade extends BaseFacade<QueuesEntity, QueuesFilter> {
    readonly queues$ = this.items$;

    constructor(
        private readonly fetchQueuesUseCase: FetchQueuesUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchQueues(
        filter: QueuesFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchQueuesUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchQueuesUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch$);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch$ = this.fetchQueuesUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
