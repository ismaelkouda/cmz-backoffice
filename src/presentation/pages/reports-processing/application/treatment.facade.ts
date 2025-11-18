import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { TreatmentEntity } from '../domain/entities/treatment/treatment.entity';
import { FetchTreatmentsUseCase } from '../domain/use-cases/treatment.use-case';
import { TreatmentFilter } from '../domain/value-objects/treatment-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class TreatmentFacade extends BaseFacade<
    TreatmentEntity,
    TreatmentFilter
> {
    readonly treatments$ = this.items$;

    constructor(
        private readonly fetchTreatmentsUseCase: FetchTreatmentsUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchTreatments(
        filter: TreatmentFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchTreatmentsUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchTreatmentsUseCase.execute(
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
        const fetch$ = this.fetchTreatmentsUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
