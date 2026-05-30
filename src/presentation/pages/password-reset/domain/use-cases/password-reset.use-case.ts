import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PasswordResetResponse } from '../entities/password-reset-response.entity';
import { PasswordResetRepository } from '../repositories/password-reset.repository';
import { ForgotPasswordRequest } from '../value-objects/forgot-password-request.vo';
import { ResetPasswordRequest } from '../value-objects/reset-password-request.vo';

@Injectable({ providedIn: 'root' })
export class ForgotPasswordUseCase {
    private readonly passwordResetRepository = inject(PasswordResetRepository);

    execute(request: ForgotPasswordRequest): Observable<PasswordResetResponse> {
        return this.passwordResetRepository.forgotPassword(request);
    }
}

@Injectable({ providedIn: 'root' })
export class ResetPasswordUseCase {
    private readonly passwordResetRepository = inject(PasswordResetRepository);

    execute(request: ResetPasswordRequest): Observable<PasswordResetResponse> {
        return this.passwordResetRepository.resetPassword(request);
    }
}
