import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ApprovalEntity } from '../domain/entities/approval/approval.entity';
import { FetchApprovalsUseCase } from '../domain/use-cases/approval.use-case';
import { ApprovalFilter } from '../domain/value-objects/approval-filter.vo';

@Injectable({ providedIn: 'root' })
export class ApprovalFacade extends BaseFacade<ApprovalEntity, ApprovalFilter> {
    readonly approvals$: Observable<ApprovalEntity[]> = this.items$;

    constructor(
        private readonly fetchApprovalsUseCase: FetchApprovalsUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchApprovals(
        filter: ApprovalFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE
    ): void {
        const fetch$ = this.fetchApprovalsUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch$);
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch$ = this.fetchApprovalsUseCase.execute(
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
        const fetch$ = this.fetchApprovalsUseCase.execute(
            currentFilter,
            currentPage
        );
        this.fetchData(currentFilter, currentPage, fetch$);
    }
}
