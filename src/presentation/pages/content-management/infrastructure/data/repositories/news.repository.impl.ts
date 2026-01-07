import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CategoryEntity } from '@presentation/pages/content-management/core/domain/entities/category.entity';
import { GetNewsByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-news-by-id.entity';
import { NewsEntity } from '@presentation/pages/content-management/core/domain/entities/news.entity';
import { NewsRepository } from '@presentation/pages/content-management/core/domain/repositories/news.repository';
import { NewsFilter } from '@presentation/pages/content-management/core/domain/value-objects/news-filter.vo';
import { NewsMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/news.mapper';
import { NewsApi } from '@presentation/pages/content-management/infrastructure/data/sources/news.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable, catchError, map, throwError } from 'rxjs';
import { CategoryMapper } from '../mappers/category.mapper';
import { GetNewsByIdMapper } from '../mappers/get-news-by-id.mapper';

@Injectable({ providedIn: 'root' })
export class NewsRepositoryImpl extends NewsRepository {
    constructor(
        private readonly api: NewsApi,
        private readonly newsMapper: NewsMapper,
        private readonly getNewsByIdMapper: GetNewsByIdMapper,
        private readonly categoryMapper: CategoryMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchNews(
        filter: NewsFilter,
        page: string
    ): Observable<Paginate<NewsEntity>> {
        return this.api.fetchNews(filter.toDto(), page).pipe(
            map((response) => this.newsMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_ALL'
                                  )
                        )
                )
            )
        );
    }

    getNewsById(id: string): Observable<GetNewsByIdEntity> {
        return this.api
            .getNewsById(id)
            .pipe(map((dto) => this.getNewsByIdMapper.toEntity(dto)));
    }

    getCategory(): Observable<CategoryEntity[]> {
        return this.api
            .getCategory()
            .pipe(
                map((apiResponse) =>
                    this.categoryMapper.mapCategoriesFromApiResponse(
                        apiResponse
                    )
                )
            );
    }

    createNews(payload: FormData): Observable<NewsEntity> {
        return this.api
            .createNews(payload)
            .pipe(map((dto) => this.newsMapper.toEntity(dto)));
    }

    updateNews(id: string, payload: FormData): Observable<NewsEntity> {
        return this.api
            .updateNews(id, payload)
            .pipe(map((dto) => this.newsMapper.toEntity(dto)));
    }

    deleteNews(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.deleteNews(id);
    }

    enableNews(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.enableNews(id);
    }

    disableNews(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.disableNews(id);
    }
}
