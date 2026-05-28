import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ServicesResponseDto } from '../../api/dto/services/services-response.dto';
import { MONITORING_API_BASE_URL } from '../../api/monitoring.config';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';

@Injectable({
    providedIn: 'root',
})
export class ServicesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(MONITORING_API_BASE_URL);

    getServices(): Observable<ServicesResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.SERVICES}`;

        return this.http.get<ServicesResponseDto>(url);
    }
}
