import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { WaitingEntity } from '@presentation/pages/report-requests/domain/entities/waiting/waiting.entity';
import { FetchWaitingUseCase } from '@presentation/pages/report-requests/domain/use-cases/waiting.use-case';
import { WaitingFilter } from '@presentation/pages/report-requests/domain/value-objects/waiting-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WaitingFacade extends BaseFacade<WaitingEntity, WaitingFilter> {
    readonly waiting$: Observable<WaitingEntity[]> = this.items$;

    constructor(
        private readonly fetchUseCase: FetchWaitingUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchWaiting(
        filter: WaitingFilter,
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
