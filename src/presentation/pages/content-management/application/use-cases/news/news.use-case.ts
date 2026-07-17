import { inject, Injectable } from '@angular/core';
import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';
import { NewsFilterDto } from '@pages/content-management/application/dto/news/news-filter.dto';
import { NewsPublishDto } from '@pages/content-management/application/dto/news/news-publish.dto';
import { NewsUnpublishDto } from '@pages/content-management/application/dto/news/news-unpublish.dto';
import { NewsCreateContract } from '@pages/content-management/domain/contracts/news/news-create.contract';
import { NewsUpdateContract } from '@pages/content-management/domain/contracts/news/news-update.contract';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsRepository } from '@pages/content-management/domain/repositories/news/news-repository';
import { newsCreateVo } from '@pages/content-management/domain/value-objects/news/news-create.vo';
import { newsDeleteVo } from '@pages/content-management/domain/value-objects/news/news-delete.vo';
import { newsFilterVo } from '@pages/content-management/domain/value-objects/news/news-filter.vo';
import { newsPublishVo } from '@pages/content-management/domain/value-objects/news/news-publish.vo';
import { newsUnpublishVo } from '@pages/content-management/domain/value-objects/news/news-unpublish.vo';
import { newsUpdateVo } from '@pages/content-management/domain/value-objects/news/news-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsUseCase {
    private readonly repository = inject(NewsRepository);

    execute(
        dto: NewsFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NewsEntity>> {
        return defer(() =>
            this.repository.readAll(newsFilterVo(dto), page, options)
        );
    }

    create(dto: NewsCreateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.create(newsCreateVo(dto)));
    }

    update(dto: NewsUpdateContract): Observable<SimpleResponseDto<void>> {
        return defer(() => this.repository.update(newsUpdateVo(dto)));
    }

    publish(dto: NewsPublishDto): Observable<SimpleResponseDto<void>> {
        return this.repository.publish(newsPublishVo(dto));
    }

    unpublish(dto: NewsUnpublishDto): Observable<SimpleResponseDto<void>> {
        return this.repository.unpublish(newsUnpublishVo(dto));
    }

    delete(dto: NewsDeleteDto): Observable<SimpleResponseDto<void>> {
        return this.repository.delete(newsDeleteVo(dto));
    }
}
