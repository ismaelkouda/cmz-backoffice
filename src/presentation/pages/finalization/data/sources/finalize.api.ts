import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { FinalizeRequestDto } from '../dtos/finalize/finalize-request.dto';
import { FinalizeResponseDto } from '../dtos/finalize/finalize-response.dto';
import { FINALIZE_ENDPOINTS } from '../endpoint/finalize-endpoints';

@Injectable({
    providedIn: 'root',
})
export class FinalizeApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchFinalizes(
        payload: FinalizeRequestDto,
        page: string
    ): Observable<FinalizeResponseDto> {
        const url = `${this.baseUrl}${FINALIZE_ENDPOINTS.FINALIZES.replace('{page}', page)}`;

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

        return this.http.get<FinalizeResponseDto>(url, { params });
    }
}
