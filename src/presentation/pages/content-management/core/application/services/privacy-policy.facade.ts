import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CreatePrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/create-privacy-policy.use-case';
import { DeletePrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/delete-privacy-policy.use-case';
import { GetPrivacyPolicyByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/get-privacy-policy-by-id.use-case';
import { FetchPrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/privacy-policy.use-case';
import { PublishPrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/publish-privacy-policy.use-case';
import { UnpublishPrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/unpublish-privacy-policy.use-case';
import { UpdatePrivacyPolicyUseCase } from '@presentation/pages/content-management/core/application/use-cases/privacy-policy/update-privacy-policy.use-case';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/core/domain/entities/privacy-policy.entity';
import { PrivacyPolicyFilter } from '@presentation/pages/content-management/core/domain/value-objects/privacy-policy-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { GetPrivacyPolicyByIdEntity } from '../../domain/entities/get-privacy-policy-by-id.entity';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyFacade extends BaseFacade<
    PrivacyPolicyEntity,
    PrivacyPolicyFilter
> {
    readonly privacyPolicy$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchPrivacyPolicyUseCase,
        private readonly createUseCase: CreatePrivacyPolicyUseCase,
        private readonly updateUseCase: UpdatePrivacyPolicyUseCase,
        private readonly getByIdUseCase: GetPrivacyPolicyByIdUseCase,
        private readonly deleteUseCase: DeletePrivacyPolicyUseCase,
        private readonly publishUseCase: PublishPrivacyPolicyUseCase,
        private readonly unpublishUseCase: UnpublishPrivacyPolicyUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchPrivacyPolicy(
        filter: PrivacyPolicyFilter,
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

    getById(id: string): Observable<GetPrivacyPolicyByIdEntity> {
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
