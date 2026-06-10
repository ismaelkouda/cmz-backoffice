import { Injectable } from '@angular/core';
import { NewsCreateEntity } from '@pages/content-management/domain/entities/news/news-create.entity';
import { NewsDeleteEntity } from '@pages/content-management/domain/entities/news/news-delete.entity';
import { NewsFilterEntity } from '@pages/content-management/domain/entities/news/news-filter.entity';
import { NewsPublishEntity } from '@pages/content-management/domain/entities/news/news-publish.entity';
import { NewsUnpublishEntity } from '@pages/content-management/domain/entities/news/news-unpublish.entity';
import { NewsUpdateEntity } from '@pages/content-management/domain/entities/news/news-update.entity';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class NewsRepository {
    abstract readAll(
        entity: NewsFilterEntity | null,
        page: string,
        options?: FetchOptions
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
    abstract publish(
        entity: NewsPublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        entity: NewsUnpublishEntity
    ): Observable<SimpleResponseDto<void>>;
}
