import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvService } from '@shared/services/env.service';
import { buildHttpParams } from '@shared/utils/utils/build-http-params.utils';

import { QueuesFilterApiDto } from '../dtos/queues/queues-filter-api.dto';
import { QueuesResponseDto } from '../dtos/queues/queues-response.dto';
import { QUEUES_ENDPOINTS } from '../endpoint/queues-endpoints';

@Injectable({
    providedIn: 'root',
})
export class QueuesApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    execute(
        filter: QueuesFilterApiDto,
        page: string
    ): Observable<QueuesResponseDto> {
        const url = `${this.baseUrl}${QUEUES_ENDPOINTS.QUEUES.replace('{page}', page)}`;

        const params = buildHttpParams(filter);

        return this.http.get<QueuesResponseDto>(url, { params });
    }
}
