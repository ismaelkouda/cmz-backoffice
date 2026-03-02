import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { NewsCreateDto } from '@presentation/pages/content-management/application/dto/news/news-create.dto';
import { NewsDeleteDto } from '@presentation/pages/content-management/application/dto/news/news-delete.dto';
import { NewsDisableDto } from '@presentation/pages/content-management/application/dto/news/news-disable.dto';
import { NewsEnableDto } from '@presentation/pages/content-management/application/dto/news/news-enable.dto';
import { NewsFilterDto } from '@presentation/pages/content-management/application/dto/news/news-filter.dto';
import { NewsUpdateDto } from '@presentation/pages/content-management/application/dto/news/news-update.dto';
import { NewsCreateEntity } from '@presentation/pages/content-management/domain/entities/news/news-create.entity';
import { NewsDeleteEntity } from '@presentation/pages/content-management/domain/entities/news/news-delete.entity';
import { NewsDisableEntity } from '@presentation/pages/content-management/domain/entities/news/news-disable.entity';
import { NewsEnableEntity } from '@presentation/pages/content-management/domain/entities/news/news-enable.entity';
import { NewsFilterEntity } from '@presentation/pages/content-management/domain/entities/news/news-filter.entity';
import { NewsUpdateEntity } from '@presentation/pages/content-management/domain/entities/news/news-update.entity';
import { NewsEntity } from '@presentation/pages/content-management/domain/entities/news/news.entity';
import { NewsRepository } from '@presentation/pages/content-management/domain/repositories/news/news-repository';
import { NewsCreateVo } from '@presentation/pages/content-management/domain/value-objects/news/news-create.vo';
import { NewsDeleteVo } from '@presentation/pages/content-management/domain/value-objects/news/news-delete.vo';
import { NewsDisableVo } from '@presentation/pages/content-management/domain/value-objects/news/news-disable.vo';
import { NewsEnableVo } from '@presentation/pages/content-management/domain/value-objects/news/news-enable.vo';
import { NewsFilterVo } from '@presentation/pages/content-management/domain/value-objects/news/news-filter.vo';
import { NewsUpdateVo } from '@presentation/pages/content-management/domain/value-objects/news/news-update.vo';

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

    enable(dto: NewsEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsEnableVo.fromDto(dto);
        const entity = NewsEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: NewsDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsDisableVo.fromDto(dto);
        const entity = NewsDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(dto: NewsDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = NewsDeleteVo.fromDto(dto);
        const entity = NewsDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
