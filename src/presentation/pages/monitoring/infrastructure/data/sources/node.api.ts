import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { NodeResponseDto } from '../../api/dto/node/node-response.dto';
import { MONITORING_API_BASE_URL } from '../../api/monitoring.config';
import { MONITORING_ENDPOINTS } from '../../api/monitoring.endpoints';

@Injectable({
    providedIn: 'root',
})
export class NodeApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(MONITORING_API_BASE_URL);

    getNode(): Observable<NodeResponseDto> {
        const url = `${this.baseUrl}${MONITORING_ENDPOINTS.NODE}`;

        return this.http.get<NodeResponseDto>(url);
    }
}
