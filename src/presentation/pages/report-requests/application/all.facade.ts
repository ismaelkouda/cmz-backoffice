import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AllEntity } from '../domain/entities/all/all.entity';
import { FetchAllUseCase } from '../domain/use-cases/all.use-case';
import { AllFilter } from '../domain/value-objects/all-filter.vo';

@Injectable({ providedIn: 'root' })
export class AllFacade extends BaseFacade<AllEntity, AllFilter> {
    readonly all$: Observable<AllEntity[]> = this.items$;

    constructor(
        private readonly fetchAllUseCase: FetchAllUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchAll(
        filter: AllFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchAllUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchAllUseCase.execute(
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
        const fetch$ = this.fetchAllUseCase.execute(currentFilter, currentPage);
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
