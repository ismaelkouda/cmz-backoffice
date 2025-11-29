import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PasswordResetResponse } from '../entities/password-reset-response.entity';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { ForgotPasswordRequest } from '../value-objects/forgot-password-request.vo';
import { ResetPasswordRequest } from '../value-objects/reset-password-request.vo';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository
    ) {}

    execute(request: ForgotPasswordRequest): Observable<PasswordResetResponse> {
        return this.passwordResetRepository.forgotPassword(request);
    }
}

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
    constructor(
        private readonly passwordResetRepository: PasswordResetRepository
    ) {}

    execute(request: ResetPasswordRequest): Observable<PasswordResetResponse> {
        return this.passwordResetRepository.resetPassword(request);
    }
}
