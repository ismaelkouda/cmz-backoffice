import { inject, Injectable } from '@angular/core';
import { CreateTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/create-terms-use.use-case';
import { DeleteTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/delete-terms-use.use-case';
import { GetTermsUseByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/get-terms-use-by-id.use-case';
import { PublishTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/publish-terms-use.use-case';
import { FetchTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/terms-use.use-case';
import { UpdateTermsUseUseCase } from '@presentation/pages/content-management/core/application/use-cases/terms-use/update-terms-use.use-case';
import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { TermsUseFilter } from '@presentation/pages/content-management/core/domain/value-objects/terms-use-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { GetTermsUseByIdEntity } from '../../domain/entities/get-terms-use-by-id.entity';
import { UnpublishTermsUseUseCase } from '../use-cases/terms-use/unpublish-terms-use.use-case';
@Injectable({
    providedIn: 'root',
})
export class TermsUseFacade extends BaseFacade<TermsUseEntity, TermsUseFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchTermsUseUseCase);
    private readonly createUseCase = inject(CreateTermsUseUseCase);
    private readonly updateUseCase = inject(UpdateTermsUseUseCase);
    private readonly getByIdUseCase = inject(GetTermsUseByIdUseCase);
    private readonly deleteUseCase = inject(DeleteTermsUseUseCase);
    private readonly publishUseCase = inject(PublishTermsUseUseCase);
    private readonly unpublishUseCase = inject(UnpublishTermsUseUseCase);
    readonly termsUse$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchTermsUse(filter: TermsUseFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
        const hasData = this.itemsSubject.getValue().length > 0;
        if (!shouldFetch(forceRefresh, hasData, this.lastFetchTimestamp, this.STALE_TIME)) return;

        this.fetchWithFilterAndPage(filter, page, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.hasInitialized = true;
        this.lastFetchTimestamp = Date.now();
    }

    refresh(): void {
        this.filterSubject.next(null);

        const firstPage = PAGINATION_CONST.DEFAULT_PAGE;
        this.pageSubject.next(firstPage);

        this.fetchWithFilterAndPage(null, firstPage, this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    changePage(pageNumber: number): void {
        const currentFilter = this.filterSubject.getValue();
        if (!currentFilter) return;

        this.fetchWithFilterAndPage(currentFilter, String(pageNumber), this.fetchUseCase.execute.bind(this.fetchUseCase), this.uiFeedbackService);

        this.lastFetchTimestamp = Date.now();
    }

    getById(id: string): Observable<GetTermsUseByIdEntity> {
        return this.getByIdUseCase.execute(id);
    }

    create(payload: FormData): Observable<SimpleResponseDto<void>> {
        return this.handleActionWithRefresh(this.createUseCase.execute(payload), 'COMMON.SUCCESS.CREATE');
    }

    update(
        id: string,
        formData: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.handleActionWithRefresh(this.updateUseCase.execute({ id, params: formData }), 'COMMON.SUCCESS.UPDATE');
    }

    delete(id: string): Observable<SimpleResponseDto<void>> {
        return this.handleActionWithRefresh(this.deleteUseCase.execute(id), 'COMMON.SUCCESS.DELETE');
    }

    publish(id: string): Observable<SimpleResponseDto<void>> {
        return this.handleActionWithRefresh(this.publishUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
    }

    unpublish(id: string): Observable<SimpleResponseDto<void>> {
        return this.handleActionWithRefresh(this.unpublishUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
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
