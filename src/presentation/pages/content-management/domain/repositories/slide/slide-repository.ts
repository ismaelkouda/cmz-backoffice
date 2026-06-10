import { Injectable } from '@angular/core';
import { SlideCreateEntity } from '@pages/content-management/domain/entities/slide/slide-create.entity';
import { SlideDeleteEntity } from '@pages/content-management/domain/entities/slide/slide-delete.entity';
import { SlideDisableEntity } from '@pages/content-management/domain/entities/slide/slide-disable.entity';
import { SlideEnableEntity } from '@pages/content-management/domain/entities/slide/slide-enable.entity';
import { SlideFilterEntity } from '@pages/content-management/domain/entities/slide/slide-filter.entity';
import { SlideUpdateEntity } from '@pages/content-management/domain/entities/slide/slide-update.entity';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export abstract class SlideRepository {
    abstract readAll(
        entity: SlideFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>>;
    abstract create(
        entity: SlideCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: SlideUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: SlideDisableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: SlideEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: SlideDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
}
