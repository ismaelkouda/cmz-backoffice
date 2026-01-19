import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GetPrivacyPolicyByIdEntity } from '@presentation/pages/content-management/core/domain/entities/get-privacy-policy-by-id.entity';
import { PrivacyPolicyEntity } from '@presentation/pages/content-management/core/domain/entities/privacy-policy.entity';
import { PrivacyPolicyRepository } from '@presentation/pages/content-management/core/domain/repositories/privacy-policy.repository';
import { PrivacyPolicyFilter } from '@presentation/pages/content-management/core/domain/value-objects/privacy-policy-filter.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dtos/simple-response.dto';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetPrivacyPolicyByIdMapper } from '../mappers/get-privacy-policy-by-id.mapper';
import { PrivacyPolicyMapper } from '../mappers/privacy-policy.mapper';
import { PrivacyPolicyApi } from '../sources/privacy-policy.api';

@Injectable({
    providedIn: 'root',
})
export class PrivacyPolicyRepositoryImpl implements PrivacyPolicyRepository {
    constructor(
        private readonly api: PrivacyPolicyApi,
        private readonly mapper: PrivacyPolicyMapper,
        private readonly getPrivacyPolicyByIdMapper: GetPrivacyPolicyByIdMapper,
        private readonly translateService: TranslateService
    ) { }

    fetchPrivacyPolicy(
        filter: PrivacyPolicyFilter,
        page: string
    ): Observable<Paginate<PrivacyPolicyEntity>> {
        return this.api.fetchPrivacyPolicy(filter?.toDto() ?? {}, page).pipe(
            map((response) => this.mapper.mapFromDto(response))
        );
    }

    getPrivacyPolicyById(id: string): Observable<GetPrivacyPolicyByIdEntity> {
        return this.api
            .getPrivacyPolicyById(id)
            .pipe(map((dto) => this.getPrivacyPolicyByIdMapper.toEntity(dto)));
    }

    createPrivacyPolicy(params: FormData): Observable<SimpleResponseDto<void>> {
        return this.api
            .createPrivacyPolicy(params)
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

    updatePrivacyPolicy(
        id: string,
        params: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.api
            .updatePrivacyPolicy(id, params)
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

    deletePrivacyPolicy(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .deletePrivacyPolicy(id)
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

    publishPrivacyPolicy(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .publishPrivacyPolicy(id)
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

    unpublishPrivacyPolicy(id: string): Observable<SimpleResponseDto<void>> {
        return this.api
            .unpublishPrivacyPolicy(id)
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
