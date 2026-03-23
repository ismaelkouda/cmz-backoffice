import { inject, Injectable } from '@angular/core';
import { NewsCreateDto } from '@pages/content-management/application/dto/news/news-create.dto';
import { NewsDeleteDto } from '@pages/content-management/application/dto/news/news-delete.dto';
import { NewsFilterDto } from '@pages/content-management/application/dto/news/news-filter.dto';
import { NewsUpdateDto } from '@pages/content-management/application/dto/news/news-update.dto';
import { NewsCreateEntity } from '@pages/content-management/domain/entities/news/news-create.entity';
import { NewsDeleteEntity } from '@pages/content-management/domain/entities/news/news-delete.entity';
import { NewsFilterEntity } from '@pages/content-management/domain/entities/news/news-filter.entity';
import { NewsUpdateEntity } from '@pages/content-management/domain/entities/news/news-update.entity';
import { NewsEntity } from '@pages/content-management/domain/entities/news/news.entity';
import { NewsRepository } from '@pages/content-management/domain/repositories/news/news-repository';
import { NewsCreateVo } from '@pages/content-management/domain/value-objects/news/news-create.vo';
import { NewsDeleteVo } from '@pages/content-management/domain/value-objects/news/news-delete.vo';
import { NewsFilterVo } from '@pages/content-management/domain/value-objects/news/news-filter.vo';
import { NewsUpdateVo } from '@pages/content-management/domain/value-objects/news/news-update.vo';
import { NewsPublishDto } from '@presentation/pages/content-management/application/dto/news/news-publish.dto';
import { NewsUnpublishDto } from '@presentation/pages/content-management/application/dto/news/news-unpublish.dto';
import { NewsPublishEntity } from '@presentation/pages/content-management/domain/entities/news/news-publish.entity';
import { NewsUnpublishEntity } from '@presentation/pages/content-management/domain/entities/news/news-unpublish.entity';
import { NewsPublishVo } from '@presentation/pages/content-management/domain/value-objects/news/news-publish.vo';
import { NewsUnpublishVo } from '@presentation/pages/content-management/domain/value-objects/news/news-unpublish.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class NewsUseCase {
    private readonly repository = inject(NewsRepository);

    execute(
        dto: NewsFilterDto | null,
        page: string
    ): Observable<Paginate<NewsEntity>> {
        const vo = NewsFilterVo.fromDto(dto);
        const entity = NewsFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: NewsCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsCreateVo.fromDto(dto);
        const entity = NewsCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: NewsUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsUpdateVo.fromDto(dto);
        const entity = NewsUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    publish(dto: NewsPublishDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsPublishVo.fromDto(dto);
        const entity = NewsPublishEntity.fromVo(vo);
        return this.repository.publish(entity);
    }

    unpublish(dto: NewsUnpublishDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsUnpublishVo.fromDto(dto);
        const entity = NewsUnpublishEntity.fromVo(vo);
        return this.repository.unpublish(entity);
    }

    delete(dto: NewsDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsDeleteVo.fromDto(dto);
        const entity = NewsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
