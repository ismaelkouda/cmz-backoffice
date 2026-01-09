import { inject, Injectable } from '@angular/core';
import { CreateSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/create-slide.use-case';
import { DeleteSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/delete-slide.use-case';
import { DisableSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/disable-slide.use-case';
import { EnableSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/enable-slide.use-case';
import { GetSlideByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/get-slide-by-id.use-case';
import { FetchSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/slide.use-case';
import { UpdateSlideUseCase } from '@presentation/pages/content-management/core/application/use-cases/update-slide.use-case';
import { SlideEntity } from '@presentation/pages/content-management/core/domain/entities/slide.entity';
import { SlideFilter } from '@presentation/pages/content-management/core/domain/value-objects/slide-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideFacade extends BaseFacade<SlideEntity, SlideFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchSlideUseCase);
    private readonly getByIdUseCase = inject(GetSlideByIdUseCase);
    private readonly createUseCase = inject(CreateSlideUseCase);
    private readonly updateUseCase = inject(UpdateSlideUseCase);
    private readonly deleteUseCase = inject(DeleteSlideUseCase);
    private readonly enableUseCase = inject(EnableSlideUseCase);
    private readonly disableUseCase = inject(DisableSlideUseCase);

    public readonly slide$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchSlide(filter: SlideFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
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

    getSlideById(id: string): Observable<SlideEntity> {
        return this.getByIdUseCase.execute(id);
    }

    createSlide(payload: FormData) {
        return this.handleActionWithRefresh(this.createUseCase.execute(payload), 'COMMON.SUCCESS.CREATE');
    }

    updateSlide(id: string, payload: FormData) {
        return this.handleActionWithRefresh(this.updateUseCase.execute({ id, data: payload }), 'COMMON.SUCCESS.UPDATE');
    }

    deleteSlide(id: string) {
        return this.handleActionWithRefresh(this.deleteUseCase.execute(id), 'COMMON.SUCCESS.DELETE');
    }

    enableSlide(id: string) {
        return this.handleActionWithRefresh(this.enableUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
    }

    disableSlide(id: string) {
        return this.handleActionWithRefresh(this.disableUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
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
