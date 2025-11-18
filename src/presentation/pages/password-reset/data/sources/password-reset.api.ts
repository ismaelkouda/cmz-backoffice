import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EnvService } from '@shared/services/env.service';
import { PasswordResetEndpoint } from '../constants/password-reset-endpoints.constant';
import { ForgotPasswordRequestDto } from '../dtos/forgot-password-request.dto';
import { PasswordResetResponseDto } from '../dtos/password-reset-response.dto';
import { ResetPasswordRequestDto } from '../dtos/reset-password-request.dto';

@Injectable({ providedIn: 'root' })
export class PasswordResetApi {
    private readonly baseUrl = this.envService.authenticationUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

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

