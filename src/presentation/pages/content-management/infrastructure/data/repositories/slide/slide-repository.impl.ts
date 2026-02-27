import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

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
import { SlideRepository } from '@presentation/pages/content-management/domain/repositories/slide/slide-repository';
import { slideCreateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-create.mapper';
import { slideDeleteMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-delete.mapper';
import { slideFilterMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-filter.mapper';
import { slidePublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-publish.mapper';
import { slideUnpublishMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-unpublish.mapper';
import { slideUpdateMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide-update.mapper';
import { SlideMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/slide/slide.mapper';
import { SlideApi } from '@presentation/pages/content-management/infrastructure/data/sources/slide/slide.api';

@Injectable({
    providedIn: 'root',
})
export class SlideRepositoryImpl implements SlideRepository {
    private readonly api = inject(SlideApi);
    private readonly mapper = inject(SlideMapper);

    readAll(
        filter: SlideFilterEntity,
        page: string
    ): Observable<Paginate<SlideEntity>> {
        return this.api
            .readAll(slideFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: SlideCreateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.create(slideCreateMapper(payload));
    }

    update(payload: SlideUpdateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.update(slideUpdateMapper(payload));
    }

    delete(entity: SlideDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(slideDeleteMapper(entity));
    }

    publish(entity: SlidePublishEntity): Observable<SimpleResponseDto<void>> {
        return this.api.publish(slidePublishMapper(entity));
    }

    unpublish(
        entity: SlideUnpublishEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.unpublish(slideUnpublishMapper(entity));
    }
}
