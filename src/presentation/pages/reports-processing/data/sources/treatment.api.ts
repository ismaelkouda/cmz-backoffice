import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';
import { TreatmentRequestDto } from '../dtos/treatment/treatment-request.dto';
import { TreatmentResponseDto } from '../dtos/treatment/treatment-response.dto';
import { TREATMENT_ENDPOINTS } from '../endpoint/treatment-endpoints';

@Injectable({
    providedIn: 'root',
})
export class TreatmentApi {
    private readonly baseUrl = this.envService.reportUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchTreatments(
        payload: TreatmentRequestDto,
        page: string
    ): Observable<TreatmentResponseDto> {
        const url = `${this.baseUrl}${TREATMENT_ENDPOINTS.TREATMENTS.replace('{page}', page)}`;

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

        return this.http.get<TreatmentResponseDto>(url, { params });
    }
}
