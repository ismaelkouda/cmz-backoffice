import { inject, Injectable } from '@angular/core';
import { HomeEntity } from '@presentation/pages/content-management/core/domain/entities/home.entity';
import { HomeFilter } from '@presentation/pages/content-management/core/domain/value-objects/home-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import {
    CreateHomeUseCase,
    DeleteHomeUseCase,
    DisableHomeUseCase,
    EnableHomeUseCase,
    FetchHomeUseCase,
    GetHomeByIdUseCase,
    UpdateHomeUseCase,
} from '../use-cases/home.use-case';

@Injectable({ providedIn: 'root' })
export class HomeFacade extends BaseFacade<HomeEntity, HomeFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchHomeUseCase);
    private readonly getByIdUseCase = inject(GetHomeByIdUseCase);
    private readonly createUseCase = inject(CreateHomeUseCase);
    private readonly updateUseCase = inject(UpdateHomeUseCase);
    private readonly deleteUseCase = inject(DeleteHomeUseCase);
    private readonly enableUseCase = inject(EnableHomeUseCase);
    private readonly disableUseCase = inject(DisableHomeUseCase);

    readonly home$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchHome(filter: HomeFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
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

    getHomeById(id: string): Observable<HomeEntity> {
        return this.getByIdUseCase.execute(id);
    }

    createHome(payload: FormData) {
        return this.handleActionWithRefresh(this.createUseCase.execute(payload), 'COMMON.SUCCESS.CREATE');
    }

    updateHome(id: string, payload: FormData) {
        return this.handleActionWithRefresh(this.updateUseCase.execute(id, payload), 'COMMON.SUCCESS.UPDATE');
    }

    deleteHome(id: string) {
        return this.handleActionWithRefresh(this.deleteUseCase.execute(id), 'COMMON.SUCCESS.DELETE');
    }

    enableHome(id: string) {
        return this.handleActionWithRefresh(this.enableUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
    }

    disableHome(id: string) {
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
