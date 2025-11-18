import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { QueueEntity } from '../domain/entities/queue/queue.entity';
import { FetchQueueUseCase } from '../domain/use-cases/queue.use-case';
import { QueueFilter } from '../domain/value-objects/queue-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class QueueFacade extends BaseFacade<QueueEntity, QueueFilter> {
    readonly queues$ = this.items$;

    constructor(
        private readonly fetchQueueUseCase: FetchQueueUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchQueue(
        filter: QueueFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchQueueUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchQueueUseCase.execute(
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
        const fetch$ = this.fetchQueueUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
