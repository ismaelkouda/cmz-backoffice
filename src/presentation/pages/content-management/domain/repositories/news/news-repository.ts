import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { NewsCreateEntity } from '@presentation/pages/content-management/domain/entities/news/news-create.entity';
import { NewsDeleteEntity } from '@presentation/pages/content-management/domain/entities/news/news-delete.entity';
import { NewsDisableEntity } from '@presentation/pages/content-management/domain/entities/news/news-disable.entity';
import { NewsEnableEntity } from '@presentation/pages/content-management/domain/entities/news/news-enable.entity';
import { NewsFilterEntity } from '@presentation/pages/content-management/domain/entities/news/news-filter.entity';
import { NewsUpdateEntity } from '@presentation/pages/content-management/domain/entities/news/news-update.entity';
import { NewsEntity } from '@presentation/pages/content-management/domain/entities/news/news.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class NewsRepository {
    abstract readAll(
        entity: NewsFilterEntity | null,
        page: string
    ): Observable<Paginate<NewsEntity>>;
    abstract create(
        entity: NewsCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: NewsUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: NewsDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: NewsEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: NewsDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
