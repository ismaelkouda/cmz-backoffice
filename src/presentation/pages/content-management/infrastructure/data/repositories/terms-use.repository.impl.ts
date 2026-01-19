import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GetTermsUseByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-terms-use-by-id.entity';
import { TermsUseEntity } from '@presentation/pages/content-management/core/domain/entities/terms-use.entity';
import { TermsUseRepository } from '@presentation/pages/content-management/core/domain/repositories/terms-use.repository';
import { TermsUseFilter } from '@presentation/pages/content-management/core/domain/value-objects/terms-use-filter.vo';
import { TermsUseMapper } from '@presentation/pages/content-management/infrastructure/data/mappers/terms-use.mapper';
import { TermsUseApi } from '@presentation/pages/content-management/infrastructure/data/sources/terms-use.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetTermsUseByIdMapper } from '../mappers/get-terms-use-by-id.mapper';

@Injectable({
    providedIn: 'root',
})
export class TermsUseRepositoryImpl extends TermsUseRepository {
    constructor(
        private readonly api: TermsUseApi,
        private readonly termsUseMapper: TermsUseMapper,
        private readonly getTermsUseByIdMapper: GetTermsUseByIdMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchTermsUse(
        filter: TermsUseFilter,
        page: string
    ): Observable<Paginate<TermsUseEntity>> {
        return this.api.fetchTermsUse(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.termsUseMapper.mapFromDto(response))
        );
    }

    getTermsUseById(id: string): Observable<GetTermsUseByIdEntity> {
        return this.api
            .getTermsUseById(id)
            .pipe(map((dto) => this.getTermsUseByIdMapper.toEntity(dto)));
    }

    createTermsUse(params: FormData): Observable<SimpleResponseDto<void>> {
        return this.api
            .createTermsUse(params)
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

    updateTermsUse(
        id: string,
        params: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.api
            .updateTermsUse(id, params)
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

    deleteTermsUse(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .deleteTermsUse(id)
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

    publishTermsUse(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .publishTermsUse(id)
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

    unpublishTermsUse(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .unpublishTermsUse(id)
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
