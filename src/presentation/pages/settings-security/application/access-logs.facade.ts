/* import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AccessLogsEntity } from '../domain/entities/access-logs/access-logs.entity';
import { FetchAccessLogsUseCase } from '../domain/use-cases/fetch-access-logs.use-case';
import { AccessLogsFilter } from '../domain/value-objects/access-logs-filter.vo';

@Injectable({ providedIn: 'root' })
export class AccessLogsFacade extends BaseFacade<
    AccessLogsEntity,
    AccessLogsFilter
> {
    readonly accessLogs$: Observable<AccessLogsEntity[]> = this.items$;

    constructor(
        private readonly fetchUseCase: FetchAccessLogsUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchAccessLogs(
        filter: AccessLogsFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh: boolean = false
    ): void {
        const fetch$ = this.fetchUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        const fetch$ = this.fetchUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch$);
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        const currentPage = this.pageSubject.getValue();
        const fetch$ = this.fetchUseCase.execute(currentFilter, currentPage);
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
 */