import { inject, Injectable } from '@angular/core';
import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';
import { NewsPublishDto } from '@pages/content-management/application/dto/news/news-publish.dto';
import { NewsUnpublishDto } from '@pages/content-management/application/dto/news/news-unpublish.dto';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsCreateProps } from '@pages/content-management/domain/interfaces/news/news-create-props.interface';
import { NewsUpdateProps } from '@pages/content-management/domain/interfaces/news/news-update-props.interface';
import { NewsRepository } from '@pages/content-management/domain/repositories/news/news-repository';
import { NewsFilterVo } from '@pages/content-management/domain/value-objects/news/news-filter.vo';
import { newsCreateMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-create.mapper';
import { newsDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-delete.mapper';
import { newsFilterMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-filter.mapper';
import { newsPublishMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-publish.mapper';
import { newsUnpublishMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-unpublish.mapper';
import { newsUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-update.mapper';
import { NewsMapper } from '@pages/content-management/infrastructure/data/mappers/news/news.mapper';
import { NewsApi } from '@pages/content-management/infrastructure/data/sources/news/news.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsRepositoryImpl implements NewsRepository {
    private readonly api = inject(NewsApi);
    private readonly mapper = inject(NewsMapper);

    readAll(
        filter: NewsFilterVo,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NewsEntity>> {
        return this.api
            .readAll(newsFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: NewsCreateProps): Observable<SimpleResponseDto<void>> {
        return this.api.create(newsCreateMapper(payload));
    }

    update(payload: NewsUpdateProps): Observable<SimpleResponseDto<void>> {
        return this.api.update(newsUpdateMapper(payload));
    }

    delete(dto: NewsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.api.delete(newsDeleteMapper(dto));
    }

    publish(dto: NewsPublishDto): Observable<SimpleResponseDto<void>> {
        return this.api.publish(newsPublishMapper(dto));
    }

    unpublish(dto: NewsUnpublishDto): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(newsUnpublishMapper(dto));
    }
}
