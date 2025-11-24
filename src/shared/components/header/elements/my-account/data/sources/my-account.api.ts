import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { MY_ACCOUNT_ENDPOINTS } from '../constants/my-account-endpoints.constant';

@Injectable({ providedIn: 'root' })
export class MyAccountApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchLogout(): Observable<SimpleResponseDto> {
        const url = `${this.baseUrl}${MY_ACCOUNT_ENDPOINTS.LOGOUT}`;
        return this.http.put<SimpleResponseDto>(url, {});
    }
}
