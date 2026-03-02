import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvService } from '@shared/domain/services/env.service';

import { PasswordResetEndpoint } from '../constants/password-reset-endpoints.constant';
import { ForgotPasswordRequestDto } from '../dto/forgot-password-request.dto';
import { PasswordResetResponseDto } from '../dto/password-reset-response.dto';
import { ResetPasswordRequestDto } from '../dto/reset-password-request.dto';

@Injectable({ providedIn: 'root' })
export class PasswordResetApi {
    private readonly envService = inject(EnvService);
    private readonly http = inject(HttpClient);
    private readonly baseUrl = this.envService.authenticationUrl;

    forgotPassword(
        payload: ForgotPasswordRequestDto
    ): Observable<PasswordResetResponseDto> {
        const url = `${this.baseUrl}${PasswordResetEndpoint.FORGOT_PASSWORD}`;
        return this.http.post<PasswordResetResponseDto>(url, payload);
    }

    resetPassword(
        payload: ResetPasswordRequestDto
    ): Observable<PasswordResetResponseDto> {
        const url = `${this.baseUrl}${PasswordResetEndpoint.RESET_PASSWORD}`;
        return this.http.post<PasswordResetResponseDto>(url, payload);
    }
}
