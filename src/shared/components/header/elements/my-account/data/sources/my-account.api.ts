import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { EnvService } from '@shared/domain/services/env.service';
import { Observable } from 'rxjs';

import { MY_ACCOUNT_ENDPOINTS } from '../constants/my-account-endpoints.constant';
import { ChangePasswordRequestDto } from '../dto/change-password-request.dto';
import { UpdateProfileRequestDto } from '../dto/update-profile-request.dto';

@Injectable({ providedIn: 'root' })
export class MyAccountApi {
    private readonly envService = inject(EnvService);
    private readonly http = inject(HttpClient);
    private readonly baseUrl = this.envService.reportUrl;

    fetchLogout(): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.LOGOUT}`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    updatePassword(
        payload: ChangePasswordRequestDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.UPDATE_PASSWORD}`;
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }

    updateProfile(
        payload: UpdateProfileRequestDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.UPDATE_PROFILE}`;
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }
}
