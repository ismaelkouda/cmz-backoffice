import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AUTH_API_URL } from '@core/config/config.tokens';
import {
    MessageResponseDto,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

import { PasswordChangeApiDto } from './dto/password-change-api.dto';
import { TwoFactorDisableApiDto } from './dto/two-factor-disable-api.dto';
import { ProfileUpdateApiDto } from './dto/profile-update-api.dto';
import { MY_ACCOUNT_ENDPOINTS } from './my-account.endpoints';
import { TwoFactorRequestApiDto } from './dto/two-factor-request-api.dto';
import { TwoFactorRequestResultApiDto } from './dto/two-factor-request-result-api.dto';
import { TwoFactorEnableApiDto } from './dto/two-factor-enable-api.dto';

@Injectable({ providedIn: 'root' })
export class MyAccountApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(AUTH_API_URL);

    logout(): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.LOGOUT}`,
            {}
        );
    }

    passwordChange(
        payload: PasswordChangeApiDto
    ): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.UPDATE_PASSWORD}`,
            payload
        );
    }

    profileUpdate(
        payload: ProfileUpdateApiDto
    ): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.UPDATE_PROFILE}`,
            payload
        );
    }

    twoFactorRequest(
        payload: TwoFactorRequestApiDto
    ): Observable<SimpleResponseDto<TwoFactorRequestResultApiDto>> {
        return this.http.put<SimpleResponseDto<TwoFactorRequestResultApiDto>>(
            `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.ENABLE_TWO_FACTOR}`,
            payload
        );
    }

    twoFactorDisable(
        payload: TwoFactorDisableApiDto
    ): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.DISABLE_TWO_FACTOR}`,
            payload
        );
    }

    twoFactorEnable(
        payload: TwoFactorEnableApiDto
    ): Observable<MessageResponseDto> {
        return this.http.put<MessageResponseDto>(
            `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.ENABLE_TWO_FACTOR}`,
            payload
        );
    }
}
