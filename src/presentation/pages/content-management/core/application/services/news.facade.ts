import { inject, Injectable } from '@angular/core';
import { CreateNewsUseCase } from '@presentation/pages/content-management/core/application/use-cases/create-news.use-case';
import { DeleteNewsUseCase } from '@presentation/pages/content-management/core/application/use-cases/delete-news.use-case';
import { DisableNewsUseCase } from '@presentation/pages/content-management/core/application/use-cases/disable-news.use-case';
import { EnableNewsUseCase } from '@presentation/pages/content-management/core/application/use-cases/enable-news.use-case';
import { GetNewsByIdUseCase } from '@presentation/pages/content-management/core/application/use-cases/get-news-by-id.use-case';
import { FetchNewsUseCase } from '@presentation/pages/content-management/core/application/use-cases/news.use-case';
import { UpdateNewsUseCase } from '@presentation/pages/content-management/core/application/use-cases/update-news.use-case';
import { NewsEntity } from '@presentation/pages/content-management/core/domain/entities/news.entity';
import { NewsFilter } from '@presentation/pages/content-management/core/domain/value-objects/news-filter.vo';
import { BaseFacade } from '@shared/application/base/base-facade';
import { handleObservableWithFeedback, shouldFetch } from '@shared/application/base/facade.utils';
import { UiFeedbackService } from '@shared/application/ui/ui-feedback.service';
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { Observable } from 'rxjs';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { GetNewsByIdEntity } from '../../domain/entities/get-news-by-id.entity';
import { GetCategoryUseCase } from '../use-cases/get-category.use-case';

@Injectable({ providedIn: 'root' })
export class NewsFacade extends BaseFacade<NewsEntity, NewsFilter> {
    private readonly uiFeedbackService = inject(UiFeedbackService);
    private readonly fetchUseCase = inject(FetchNewsUseCase);
    private readonly getByIdUseCase = inject(GetNewsByIdUseCase);
    private readonly createUseCase = inject(CreateNewsUseCase);
    private readonly updateUseCase = inject(UpdateNewsUseCase);
    private readonly deleteUseCase = inject(DeleteNewsUseCase);
    private readonly enableUseCase = inject(EnableNewsUseCase);
    private readonly disableUseCase = inject(DisableNewsUseCase);
    private readonly categoryUseCase = inject(GetCategoryUseCase);

    readonly news$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    private handleActionWithRefresh<T>(observable: Observable<T>, successKey: string): Observable<T> {
        return handleObservableWithFeedback(observable, this.uiFeedbackService, successKey, () => this.refresh());
    }

    fetchNews(filter: NewsFilter, page: string = PAGINATION_CONST.DEFAULT_PAGE, forceRefresh: boolean = false): void {
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

    getNewsById(id: string): Observable<GetNewsByIdEntity> {
        return this.getByIdUseCase.execute(id);
    }

    getCategory(): Observable<CategoryEntity[]> {
        return this.categoryUseCase.execute();
    }

    createNews(payload: FormData) {
        return this.handleActionWithRefresh(this.createUseCase.execute(payload), 'COMMON.SUCCESS.CREATE');
    }

    updateNews(id: string, payload: FormData) {
        return this.handleActionWithRefresh(this.updateUseCase.execute(id, payload), 'COMMON.SUCCESS.UPDATE');
    }

    deleteNews(id: string) {
        return this.handleActionWithRefresh(this.deleteUseCase.execute(id), 'COMMON.SUCCESS.DELETE');
    }

    enableNews(id: string) {
        return this.handleActionWithRefresh(this.enableUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
    }

    disableNews(id: string) {
        return this.handleActionWithRefresh(this.disableUseCase.execute(id), 'COMMON.SUCCESS.UPDATE');
    }

    resetMemory(): void {
        this.hasInitialized = false;
        this.lastFetchTimestamp = 0;
        this.reset();
    }
}
