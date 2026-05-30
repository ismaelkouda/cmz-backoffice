import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
    BehaviorSubject,
    Observable,
    catchError,
    finalize,
    tap,
    throwError,
} from 'rxjs';

import { PasswordResetResponse } from '../domain/entities/password-reset-response.entity';
import {
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
} from '../domain/use-cases/password-reset.use-case';
import { ForgotPasswordRequest } from '../domain/value-objects/forgot-password-request.vo';
import { ResetPasswordRequest } from '../domain/value-objects/reset-password-request.vo';

@Injectable({ providedIn: 'root' })
export class PasswordResetFacade {
    private readonly forgotPasswordUseCase = inject(ForgotPasswordUseCase);
    private readonly resetPasswordUseCase = inject(ResetPasswordUseCase);
    private readonly toastService = inject(ToastrService);
    private readonly translateService = inject(TranslateService);

    private readonly forgotPasswordLoadingSubject =
        new BehaviorSubject<boolean>(false);
    private readonly resetPasswordLoadingSubject = new BehaviorSubject<boolean>(
        false
    );

    readonly isForgotPasswordLoading$: Observable<boolean> =
        this.forgotPasswordLoadingSubject.asObservable();
    readonly isResetPasswordLoading$: Observable<boolean> =
        this.resetPasswordLoadingSubject.asObservable();

    forgotPassword(payload: {
        email: string;
    }): Observable<PasswordResetResponse> {
        const request = ForgotPasswordRequest.create(payload);
        this.forgotPasswordLoadingSubject.next(true);

        return this.forgotPasswordUseCase.execute(request).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'PASSWORD_RESET.MESSAGES.SUCCESS.EMAIL_SENT'
                );
                this.toastService.success(successMessage);
            }),
            finalize(() => this.forgotPasswordLoadingSubject.next(false)),
            catchError((error: Error) => {
                const errorMessage =
                    this.translateService.instant(error.message) ||
                    error.message;
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
    }

    resetPassword(payload: {
        password: string;
        confirmPassword: string;
        token?: string;
        email?: string;
    }): Observable<PasswordResetResponse> {
        const request = ResetPasswordRequest.create(payload);
        this.resetPasswordLoadingSubject.next(true);

        return this.resetPasswordUseCase.execute(request).pipe(
            tap(() => {
                const successMessage = this.translateService.instant(
                    'PASSWORD_RESET.MESSAGES.SUCCESS.PASSWORD_RESET'
                );
                this.toastService.success(successMessage);
            }),
            finalize(() => this.resetPasswordLoadingSubject.next(false)),
            catchError((error: Error) => {
                const errorMessage =
                    this.translateService.instant(error.message) ||
                    error.message;
                this.toastService.error(errorMessage);
                return throwError(() => error);
            })
        );
    }
}
