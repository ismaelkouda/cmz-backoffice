import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GetLegalNoticeByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-legal-notice-by-id.entity';
import { LegalNoticeEntity } from '@presentation/pages/content-management/core/domain/entities/legal-notice.entity';
import { LegalNoticeRepository } from '@presentation/pages/content-management/core/domain/repositories/legal-notice.repository';
import { LegalNoticeFilter } from '@presentation/pages/content-management/core/domain/value-objects/legal-notice-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetLegalNoticeByIdMapper } from '../mappers/get-legal-notice-by-id.mapper';
import { LegalNoticeMapper } from '../mappers/legal-notice.mapper';
import { LegalNoticeApi } from '../sources/legal-notice.api';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeRepositoryImpl implements LegalNoticeRepository {
    constructor(
        private readonly api: LegalNoticeApi,
        private readonly mapper: LegalNoticeMapper,
        private readonly getLegalNoticeByIdMapper: GetLegalNoticeByIdMapper,
        private readonly translateService: TranslateService
    ) { }

    fetchLegalNotice(
        filter: LegalNoticeFilter,
        page: string
    ): Observable<Paginate<LegalNoticeEntity>> {
        return this.api.fetchLegalNotice(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.mapper.mapFromDto(response))
        );
    }

    getLegalNoticeById(id: string): Observable<GetLegalNoticeByIdEntity> {
        return this.api
            .getLegalNoticeById(id)
            .pipe(map((dto) => this.getLegalNoticeByIdMapper.toEntity(dto)));
    }

    createLegalNotice(params: FormData): Observable<SimpleResponseDto<void>> {
        return this.api
            .createLegalNotice(params)
            .pipe(
                catchError((error: unknown) =>
                    throwError(
                        () =>
                            new Error(
                                error instanceof Error
                                    ? error.message
                                    : this.translateService.instant(
                                        'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_CREATE'
                                    )
                            )
                    )
                )
            );
    }

    updateLegalNotice(
        id: string,
        params: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.api
            .updateLegalNotice(id, params)
            .pipe(
                catchError((error: unknown) =>
                    throwError(
                        () =>
                            new Error(
                                error instanceof Error
                                    ? error.message
                                    : this.translateService.instant(
                                        'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_UPDATE'
                                    )
                            )
                    )
                )
            );
    }

    deleteLegalNotice(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .deleteLegalNotice(id)
            .pipe(
                catchError((error: unknown) =>
                    throwError(
                        () =>
                            new Error(
                                error instanceof Error
                                    ? error.message
                                    : this.translateService.instant(
                                        'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_DELETE'
                                    )
                            )
                    )
                )
            );
    }

    publishLegalNotice(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .publishLegalNotice(id)
            .pipe(
                catchError((error: unknown) =>
                    throwError(
                        () =>
                            new Error(
                                error instanceof Error
                                    ? error.message
                                    : this.translateService.instant(
                                        'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_PUBLISH'
                                    )
                            )
                    )
                )
            );
    }

    unpublishLegalNotice(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .unpublishLegalNotice(id)
            .pipe(
                catchError((error: unknown) =>
                    throwError(
                        () =>
                            new Error(
                                error instanceof Error
                                    ? error.message
                                    : this.translateService.instant(
                                        'OVERSEEING_OPERATIONS.MESSAGES.ERROR.UNABLE_TO_UNPUBLISH'
                                    )
                            )
                    )
                )
            );
    }
}
