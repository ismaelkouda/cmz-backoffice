import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CreateTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/create-terms-use.use-case';
import { DeleteTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/delete-terms-use.use-case';
import { GetTermsUseByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/get-terms-use-by-id.use-case';
import { PublishTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/publish-terms-use.use-case';
import { FetchTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/terms-use.use-case';
import { UpdateTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/update-terms-use.use-case';
import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { TermsUseFilter } from '@presentation/pages/content-management/core/domain/value-objects/terms-use-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { GetTermsUseByIdEntity } from '../../domain/entities/get-terms-use-by-id.entity';
import { UnpublishTermsUseUseCase } from '../use-cases/terms-use/unpublish-terms-use.use-case';
@Injectable({
    providedIn: 'root',
})
export class TermsUseFacade extends BaseFacade<TermsUseEntity, TermsUseFilter> {
    readonly termsUse$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchTermsUseUseCase,
        private readonly createUseCase: CreateTermsUseUseCase,
        private readonly updateUseCase: UpdateTermsUseUseCase,
        private readonly getByIdUseCase: GetTermsUseByIdUseCase,
        private readonly deleteUseCase: DeleteTermsUseUseCase,
        private readonly publishUseCase: PublishTermsUseUseCase,
        private readonly unpublishUseCase: UnpublishTermsUseUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchTermsUse(
        filter: TermsUseFilter,
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

    getById(id: string): Observable<GetTermsUseByIdEntity> {
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
