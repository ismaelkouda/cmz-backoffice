import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WaitingRequestDto } from '@presentation/pages/report-requests/data/dtos/waiting/waiting-request.dto';
import { WaitingResponseDto } from '@presentation/pages/report-requests/data/dtos/waiting/waiting-response.dto';
import { WAITING_ENDPOINTS } from '@presentation/pages/report-requests/data/endpoints/waiting-endpoints';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WaitingApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchWaiting(
        payload: WaitingRequestDto,
        page: string
    ): Observable<WaitingResponseDto> {
        const url = `${this.baseUrl}${WAITING_ENDPOINTS.WAITING.replace('{page}', page)}`;
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

        return this.http.get<WaitingResponseDto>(url, {
            params,
        });
    }
}
