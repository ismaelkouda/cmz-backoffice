import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ResourcesResponseDto } from '../../api/dto/resources/resources-response.dto';
import { MONITORING_API_BASE_URL } from '../../api/monitoring.config';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';

@Injectable({
    providedIn: 'root',
})
export class ResourcesApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(MONITORING_API_BASE_URL);

    getResources(): Observable<ResourcesResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.VARIABLES}`;

        return this.http.get<ResourcesResponseDto>(url);
    }
}
