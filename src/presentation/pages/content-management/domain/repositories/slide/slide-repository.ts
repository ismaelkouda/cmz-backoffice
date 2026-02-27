import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { SlideCreateEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideDeleteEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-delete.entity';
import { SlideFilterEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-filter.entity';
import { SlidePublishEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-publish.entity';
import { SlideUnpublishEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-unpublish.entity';
import { SlideUpdateEntity } from '@presentation/pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideEntity } from '@presentation/pages/content-management/domain/entities/slide/slide.entity';

@Injectable({
    providedIn: 'root',
})
export abstract class SlideRepository {
    abstract readAll(
        entity: SlideFilterEntity | null,
        page: string
    ): Observable<Paginate<SlideEntity>>;
    abstract create(
        entity: SlideCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: SlideUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract unpublish(
        entity: SlideUnpublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract publish(
        entity: SlidePublishEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: SlideDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
