import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { PasswordResetResponse } from '../../domain/entities/password-reset-response.entity';
import { PasswordResetRepository } from '../../domain/repositories/password-reset.repository';
import { ForgotPasswordRequest } from '../../domain/value-objects/forgot-password-request.vo';
import { ResetPasswordRequest } from '../../domain/value-objects/reset-password-request.vo';
import { PasswordResetResponseDto } from '../dtos/password-reset-response.dto';
import { PasswordResetMapper } from '../mappers/password-reset.mapper';
import { PasswordResetApi } from '../sources/password-reset.api';

@Injectable({ providedIn: 'root' })
export class PasswordResetRepositoryImpl extends PasswordResetRepository {
    constructor(
        private readonly api: PasswordResetApi,
        private readonly mapper: PasswordResetMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    override forgotPassword(
        request: ForgotPasswordRequest
    ): Observable<PasswordResetResponse> {
        return this.api.forgotPassword(request.toDto()).pipe(
            map((response: PasswordResetResponseDto) =>
                this.mapper.mapFromDto(response)
            ),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'PASSWORD_RESET.MESSAGES.ERROR.UNABLE_TO_COMPLETE_REQUEST'
                                  )
                        )
                )
            )
        );
    }

    override resetPassword(
        request: ResetPasswordRequest
    ): Observable<PasswordResetResponse> {
        return this.api.resetPassword(request.toDto()).pipe(
            map((response: PasswordResetResponseDto) =>
                this.mapper.mapFromDto(response)
            ),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'PASSWORD_RESET.MESSAGES.ERROR.UNABLE_TO_COMPLETE_RESET'
                                  )
                        )
                )
            )
        );
    }
}
