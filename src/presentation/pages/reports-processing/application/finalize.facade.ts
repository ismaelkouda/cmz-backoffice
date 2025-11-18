import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { FinalizeEntity } from '../domain/entities/finalize/finalize.entity';
import { FetchFinalizesUseCase } from '../domain/use-cases/finalize.use-case';
import { FinalizeFilter } from '../domain/value-objects/finalize-filter.vo';

@Injectable({
    providedIn: 'root',
})
export class FinalizeFacade extends BaseFacade<FinalizeEntity, FinalizeFilter> {
    readonly finalizes$ = this.items$;

    constructor(
        private readonly fetchFinalizesUseCase: FetchFinalizesUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchFinalizes(
        filter: FinalizeFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchFinalizesUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchFinalizesUseCase.execute(
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
        const fetch$ = this.fetchFinalizesUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
