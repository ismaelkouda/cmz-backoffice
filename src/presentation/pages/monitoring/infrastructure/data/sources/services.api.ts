import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ServicesResponseDto } from '../../api/dto/services/services-response.dto';
import { MONITORING_API_BASE_URL } from '../../api/monitoring.config';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';

@Injectable({
    providedIn: 'root',
})
export class ServicesApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(MONITORING_API_BASE_URL) private readonly baseUrl: string
    ) {}

    getServices(): Observable<ServicesResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.SERVICES}`;

        return this.http.get<ServicesResponseDto>(url);
    }
}
