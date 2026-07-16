import { Injectable } from '@angular/core';
import { SlideDeleteDto } from '@pages/content-management/application/dto/slide/slide-delete.dto';
import { SlideDisableDto } from '@pages/content-management/application/dto/slide/slide-disable.dto';
import { SlideEnableDto } from '@pages/content-management/application/dto/slide/slide-enable.dto';
import { SlideEntity } from '@pages/content-management/domain/entities/slide/slide.entity';
import { SlideCreateProps } from '@pages/content-management/domain/interfaces/slide/slide-create-props.interface';
import { SlideUpdateProps } from '@pages/content-management/domain/interfaces/slide/slide-update-props.interface';
import { SlideFilterVo } from '@pages/content-management/domain/value-objects/slide/slide-filter.vo';
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
        filter: SlideFilterVo | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<SlideEntity>>;
    abstract create(
        props: SlideCreateProps
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        props: SlideUpdateProps
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(dto: SlideDisableDto): Observable<SimpleResponseDto<void>>;
    abstract enable(dto: SlideEnableDto): Observable<SimpleResponseDto<void>>;
    abstract delete(dto: SlideDeleteDto): Observable<SimpleResponseDto<void>>;
}
