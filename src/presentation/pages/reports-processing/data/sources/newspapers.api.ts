import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { NewspapersRequestDto } from '../dtos/management/newspapers/newspapers-request.dto';
import { NewspapersResponseDto } from '../dtos/management/newspapers/newspapers-response.dto';
import { NEWSPAPERS_ENDPOINTS } from '../endpoint/newspapers-endpoints';

@Injectable({
    providedIn: 'root',
})
export class NewspapersApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchNewspapers(
        payload: NewspapersRequestDto,
        page: string
    ): Observable<NewspapersResponseDto> {
        const url = `${this.baseUrl}${NEWSPAPERS_ENDPOINTS.NEWSPAPERS.replace('{page}', page)}`;

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

        return this.http.get<NewspapersResponseDto>(url, { params });
    }
}
