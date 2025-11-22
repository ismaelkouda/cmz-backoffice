import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { QueuesRequestDto } from '../dtos/queues/queues-request.dto';
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

    fetchQueues(
        payload: QueuesRequestDto,
        page: string
    ): Observable<QueuesResponseDto> {
        const url = `${this.baseUrl}${QUEUES_ENDPOINTS.QUEUES.replace('{page}', page)}`;

        const paramsObject = Object.entries(payload ?? {}).reduce<
            Record<string, string>
        >((acc, [key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                acc[key] = String(value);
            }
            return acc;
        }, {});

        const params =
            Object.keys(paramsObject).length > 0
                ? new HttpParams({ fromObject: paramsObject })
                : undefined;

        return this.http.get<QueuesResponseDto>(url, { params });
    }
}
