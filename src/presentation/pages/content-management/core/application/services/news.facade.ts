import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
import { PAGINATION_CONST } from '@shared/constants/pagination.constants';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { GetCategoryUseCase } from '../use-cases/get-category.use-case';

@Injectable({ providedIn: 'root' })
export class NewsFacade extends BaseFacade<NewsEntity, NewsFilter> {
    readonly news$ = this.items$;

    private hasInitialized = false;
    private lastFetchTimestamp = 0;
    private readonly STALE_TIME = 2 * 60 * 1000;

    constructor(
        private readonly fetchUseCase: FetchNewsUseCase,
        private readonly getByIdUseCase: GetNewsByIdUseCase,
        private readonly createUseCase: CreateNewsUseCase,
        private readonly updateUseCase: UpdateNewsUseCase,
        private readonly deleteUseCase: DeleteNewsUseCase,
        private readonly enableUseCase: EnableNewsUseCase,
        private readonly disableUseCase: DisableNewsUseCase,
        private readonly categoryUseCase: GetCategoryUseCase,
        toastService: ToastrService,
        translateService: TranslateService
    ) {
        super(toastService, translateService);
    }

    fetchNews(
        filter: NewsFilter,
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

    getNewsById(id: string): Observable<NewsEntity> {
        return this.getByIdUseCase.execute(id);
    }

    getCategory(): Observable<CategoryEntity[]> {
        return this.categoryUseCase.execute();
    }

    createNews(payload: FormData): Observable<NewsEntity> {
        return this.createUseCase.execute(payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.CREATE')
                );
                this.refresh();
            })
        );
    }

    updateNews(id: string, payload: FormData): Observable<NewsEntity> {
        return this.updateUseCase.execute(id, payload).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    deleteNews(id: string): Observable<SimpleResponseDto<void>> {
        return this.deleteUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.DELETE')
                );
                this.refresh();
            })
        );
    }

    enableNews(id: string): Observable<SimpleResponseDto<void>> {
        return this.enableUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
                this.refresh();
            })
        );
    }

    disableNews(id: string): Observable<SimpleResponseDto<void>> {
        return this.disableUseCase.execute(id).pipe(
            tap(() => {
                this.toastService.success(
                    this.translateService.instant('COMMON.SUCCESS.UPDATE')
                );
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
}
