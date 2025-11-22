import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { AllRequestDto } from '../dtos/all/all-request.dto';
import { AllResponseDto } from '../dtos/all/all-response.dto';
import { ALL_ENDPOINTS } from '../endpoint/all-endpoints';

@Injectable({
    providedIn: 'root',
})
export class AllApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchAll(payload: AllRequestDto, page: string): Observable<AllResponseDto> {
        const url = `${this.baseUrl}${ALL_ENDPOINTS.ALL.replace('{page}', page)}`;

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

        return this.http.get<AllResponseDto>(url, { params });
    }
}
