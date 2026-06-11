import { inject, Injectable } from '@angular/core';
import { SlideCreateEntity } from '@pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideDeleteEntity } from '@pages/content-management/domain/entities/slide/slide-delete.entity';
import { SlideDisableEntity } from '@pages/content-management/domain/entities/slide/slide-disable.entity';
import { SlideEnableEntity } from '@pages/content-management/domain/entities/slide/slide-enable.entity';
import { SlideFilterEntity } from '@pages/content-management/domain/entities/slide/slide-filter.entity';
import { SlideUpdateEntity } from '@pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideRepository } from '@pages/content-management/domain/repositories/slide/slide-repository';
import { SlideCreateMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-create.mapper';
import { slideDeleteMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-delete.mapper';
import { slideDisableMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-disable.mapper';
import { slideEnableMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-enable.mapper';
import { slideFilterMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-filter.mapper';
import { SlideUpdateMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide-update.mapper';
import { SlideMapper } from '@pages/content-management/infrastructure/data/mappers/slide/slide.mapper';
import { SlideApi } from '@pages/content-management/infrastructure/data/sources/slide/slide.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SlideRepositoryImpl implements SlideRepository {
    private readonly api = inject(SlideApi);
    private readonly mapper = inject(SlideMapper);
    private readonly createMapper = inject(SlideCreateMapper);
    private readonly updateMapper = inject(SlideUpdateMapper);

    readAll(
        filter: SlideFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>> {
        return this.api
            .readAll(slideFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: SlideCreateEntity): Observable<SimpleResponseDto<void>> {
        const dto = this.createMapper.mapEntityToApi(payload);
        return this.api.create(dto);
    }

    update(payload: SlideUpdateEntity): Observable<SimpleResponseDto<void>> {
        const dto = this.updateMapper.mapEntityToApi(payload);
        return this.api.update(dto);
    }

    delete(entity: SlideDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(slideDeleteMapper(entity));
    }

    enable(entity: SlideEnableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.enable(slideEnableMapper(entity));
    }

    disable(entity: SlideDisableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.disable(slideDisableMapper(entity));
    }
}
