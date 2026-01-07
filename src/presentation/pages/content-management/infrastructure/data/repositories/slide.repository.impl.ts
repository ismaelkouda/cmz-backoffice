import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable, catchError, map, throwError } from 'rxjs';
import { SlideEntity } from '../../../core/domain/entities/slide.entity';
import { SlideRepository } from '../../../core/domain/repositories/slide.repository';
import { SlideFilter } from '../../../core/domain/value-objects/slide-filter.vo';
import { SlideMapper } from '../mappers/slide.mapper';
import { SlideApi } from '../sources/slide.api';

@Injectable({
    providedIn: 'root',
})
export class SlideRepositoryImpl implements SlideRepository {
    constructor(
        private readonly api: SlideApi,
        private readonly slideMapper: SlideMapper,
        private readonly translateService: TranslateService
    ) {}

    fetchSlide(
        filter: SlideFilter,
        page: string
    ): Observable<Paginate<SlideEntity>> {
        return this.api.fetchSlides(filter.toDto(), page).pipe(
            map((response) => this.slideMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_FETCH_ALL'
                                  )
                        )
                )
            )
        );
    }

    getSlideById(id: string): Observable<SlideEntity> {
        return this.api
            .getSlideById(id)
            .pipe(map((dto) => this.slideMapper.toEntity(dto.data)));
    }

    createSlide(payload: FormData): Observable<SlideEntity> {
        return this.api
            .createSlide(payload)
            .pipe(map((dto) => this.slideMapper.toEntity(dto)));
    }

    updateSlide(id: string, payload: FormData): Observable<SlideEntity> {
        return this.api
            .updateSlide(id, payload)
            .pipe(map((dto) => this.slideMapper.toEntity(dto)));
    }

    deleteSlide(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.deleteSlide(id);
    }

    enableSlide(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.enableSlide(id);
    }

    disableSlide(id: string): Observable<SimpleResponseDto<void>> {
        return this.api.disableSlide(id);
    }
}
