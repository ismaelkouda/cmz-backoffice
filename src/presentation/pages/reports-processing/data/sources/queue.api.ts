import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { QueueRequestDto } from '../dtos/queue/queue-request.dto';
import { QueueResponseDto } from '../dtos/queue/queue-response.dto';
import { QUEUE_ENDPOINTS } from '../endpoint/queue-endpoints';

@Injectable({
    providedIn: 'root',
})
export class QueueApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchQueue(
        payload: QueueRequestDto,
        page: string
    ): Observable<QueueResponseDto> {
        const url = `${this.baseUrl}${QUEUE_ENDPOINTS.QUEUES.replace('{page}', page)}`;

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

        return this.http.get<QueueResponseDto>(url, { params });
    }
}
