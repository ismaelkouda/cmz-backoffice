import { inject, Injectable } from '@angular/core';
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
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeFacade extends BaseFacade<
    LegalNoticeEntity,
    LegalNoticeFilter
> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchLegalNoticeUseCase);
    private readonly createUseCase = inject(CreateLegalNoticeUseCase);
    private readonly updateUseCase = inject(UpdateLegalNoticeUseCase);
    private readonly getByIdUseCase = inject(GetLegalNoticeByIdUseCase);
    private readonly deleteUseCase = inject(DeleteLegalNoticeUseCase);
    private readonly publishUseCase = inject(PublishLegalNoticeUseCase);
    private readonly unpublishUseCase = inject(UnpublishLegalNoticeUseCase);
    public readonly legalNotice$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchLegalNotice(filter: LegalNoticeFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
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

    getById(id: string): Observable<GetLegalNoticeByIdEntity> {
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
