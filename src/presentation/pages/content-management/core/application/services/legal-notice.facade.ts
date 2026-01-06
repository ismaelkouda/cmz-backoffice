import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CreateLegalNoticeUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/create-legal-notice.use-case';
import { DeleteLegalNoticeUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/delete-legal-notice.use-case';
import { GetLegalNoticeByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/get-legal-notice-by-id.use-case';
import { FetchLegalNoticeUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/legal-notice.use-case';
import { PublishLegalNoticeUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/publish-legal-notice.use-case';
import { UnpublishLegalNoticeUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/unpublish-legal-notice.use-case';
import { UpdateLegalNoticeUseCase } from '@presentation/pages/content-management/core/application/use-cases/legal-notice/update-legal-notice.use-case';
import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-legal-notice-by-id.entity';
import { LegalNoticeEntity } from '@presentation/pages/content-management/core/domain/entities/legal-notice.entity';
import { LegalNoticeFilter } from '@presentation/pages/content-management/core/domain/value-objects/legal-notice-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFacade extends BaseFacade<
    LegalNoticeEntity,
    LegalNoticeFilter
> {
    public readonly legalNotice$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchLegalNoticeUseCase,
        private readonly createUseCase: CreateLegalNoticeUseCase,
        private readonly updateUseCase: UpdateLegalNoticeUseCase,
        private readonly getByIdUseCase: GetLegalNoticeByIdUseCase,
        private readonly deleteUseCase: DeleteLegalNoticeUseCase,
        private readonly publishUseCase: PublishLegalNoticeUseCase,
        private readonly unpublishUseCase: UnpublishLegalNoticeUseCase,
        toastrService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastrService, translateService);
    }

    fetchLegalNotice(
        filter: LegalNoticeFilter,
        page: string = PAGINATION_CONST.DEFAULT_PAGE,
        forceRefresh: boolean = false
    ): void {
        if (!this.shouldFetch(forceRefresh)) {
            return;
        }
        const fetch = this.fetchUseCase.execute(filter, page);
        this.fetchData(filter, page, fetch);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    getById(id: string): Observable<GetLegalNoticeByIdEntity> {
        return this.getByIdUseCase.execute(id);
    }

    create(formData: FormData): Observable<SimpleResponseDto<void>> {
        return this.createUseCase.execute(formData).pipe(
            tap((response) => {
                this.toastService.success(response.message);
                this.refresh();
            })
        );
    }

    update(
        id: string,
        formData: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.updateUseCase.execute({ id, params: formData }).pipe(
            tap((response) => {
                this.toastService.success(response.message);
                this.refresh();
            })
        );
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        return this.deleteUseCase.execute(id).pipe(
            tap((response) => {
                this.toastService.success(response.message);
                this.refresh();
            })
        );
    }

    publish(id: string): Observable<SimpleResponseDto<void>> {
        return this.publishUseCase.execute(id).pipe(
            tap((response) => {
                this.toastService.success(response.message);
                this.refresh();
            })
        );
    }

    unpublish(id: string): Observable<SimpleResponseDto<void>> {
        return this.unpublishUseCase.execute(id).pipe(
            tap((response) => {
                this.toastService.success(response.message);
                this.refresh();
            })
        );
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const fetch = this.fetchUseCase.execute(
            currentFilter,
            String(pageNumber)
        );
        this.changePageInternal(pageNumber, fetch);

        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) {
            return;
        }
        const currentPage = this.pageSubject.getValue();
        const fetch = this.fetchUseCase.execute(currentFilter, currentPage);
        this.fetchData(currentFilter, currentPage, fetch);

        this.lastFetchTimestamp = Date.now();
    }

    private shouldFetch(forceRefresh: boolean): boolean {
        if (forceRefresh) {
            return true;
        }
        if (!this.hasInitialized) {
            return true;
        }
        const isStale = Date.now() - this.lastFetchTimestamp > this.STALE_TIME;
        if (isStale) {
            return true;
        }
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!hasData) {
            return true;
        }

        return false;
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }

    getMemoryStatus(): {
        hasInitialized: boolean;
        lastFetch: number;
        hasData: boolean;
    } {
        return {
            hasInitialized: this.hasInitialized,
            lastFetch: this.lastFetchTimestamp,
            hasData: this.itemsSubject.getValue().length > 0,
        };
    }
}
