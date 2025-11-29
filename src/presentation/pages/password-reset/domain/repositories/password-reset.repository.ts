import { Observable } from 'rxjs';
import { PasswordResetResponse } from '../entities/password-reset-response.entity';
import { ForgotPasswordRequest } from '../value-objects/forgot-password-request.vo';
import { ResetPasswordRequest } from '../value-objects/reset-password-request.vo';

export abstract class PasswordResetRepository {
    abstract forgotPassword(
        request: ForgotPasswordRequest
    ): Observable<PasswordResetResponse>;
    abstract resetPassword(
        request: ResetPasswordRequest
    ): Observable<PasswordResetResponse>;
}
