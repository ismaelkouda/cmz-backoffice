import { inject, Injectable } from '@angular/core';
import { NewsCreateEntity } from '@pages/content-management/domain/entities/news/news-create.entity';
import { NewsDeleteEntity } from '@pages/content-management/domain/entities/news/news-delete.entity';
import { NewsFilterEntity } from '@pages/content-management/domain/entities/news/news-filter.entity';
import { NewsUpdateEntity } from '@pages/content-management/domain/entities/news/news-update.entity';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsRepository } from '@pages/content-management/domain/repositories/news/news-repository';
import { newsCreateMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-create.mapper';
import { newsDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-delete.mapper';
import { newsFilterMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-filter.mapper';
import { newsUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/news/news-update.mapper';
import { NewsMapper } from '@pages/content-management/infrastructure/data/mappers/news/news.mapper';
import { NewsApi } from '@pages/content-management/infrastructure/data/sources/news/news.api';
import { NewsPublishEntity } from '@presentation/pages/content-management/domain/entities/news/news-publish.entity';
import { NewsUnpublishEntity } from '@presentation/pages/content-management/domain/entities/news/news-unpublish.entity';
import { newsPublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/news/news-publish.mapper';
import { newsUnpublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/news/news-unpublish.mapper';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsRepositoryImpl implements NewsRepository {
    private readonly api = inject(NewsApi);
    private readonly mapper = inject(NewsMapper);

    readAll(
        filter: NewsFilterEntity,
        page: string
    ): Observable<Paginate<NewsEntity>> {
        return this.api
            .readAll(newsFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: NewsCreateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.create(newsCreateMapper(payload));
    }

    update(payload: NewsUpdateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.update(newsUpdateMapper(payload));
    }

    delete(entity: NewsDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(newsDeleteMapper(entity));
    }

    publish(entity: NewsPublishEntity): Observable<SimpleResponseDto<void>> {
        return this.api.publish(newsPublishMapper(entity));
    }

    unpublish(
        entity: NewsUnpublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(newsUnpublishMapper(entity));
    }
}
