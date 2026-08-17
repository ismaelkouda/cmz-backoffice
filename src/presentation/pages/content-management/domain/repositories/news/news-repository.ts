import { Injectable } from '@angular/core';
import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';
import { NewsPublishDto } from '@pages/content-management/application/dto/news/news-publish.dto';
import { NewsUnpublishDto } from '@pages/content-management/application/dto/news/news-unpublish.dto';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsCreateProps } from '@pages/content-management/domain/interfaces/news/news-create-props.interface';
import { NewsUpdateProps } from '@pages/content-management/domain/interfaces/news/news-update-props.interface';
import { NewsFilterVo } from '@pages/content-management/domain/value-objects/news/news-filter.vo';
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
        filter: NewsFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NewsEntity>>;
    abstract create(
        props: NewsCreateProps
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: NewsUpdateProps
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(dto: NewsDeleteDto): Observable<SimpleResponseDto<void>>;
    abstract publish(dto: NewsPublishDto): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        dto: NewsUnpublishDto
    ): Observable<SimpleResponseDto<void>>;
}
