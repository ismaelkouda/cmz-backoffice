import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetTermsUseByIdResponseDto } from '@presentation/pages/content-management/core/application/dtos/terms-use/get-terms-use-by-id-response.dto';
import { TermsUseRequestDto } from '@presentation/pages/content-management/core/application/dtos/terms-use/terms-use-request.dto';
import { TermsUseResponseDto } from '@presentation/pages/content-management/core/application/dtos/terms-use/terms-use-response.dto';
import { TERMS_USE_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/data/endpoints/terms-use-endpoints';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TermsUseApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    fetchTermsUse(
        payload: TermsUseRequestDto,
        page: string
    ): Observable<TermsUseResponseDto> {
        const url = `${this.baseUrl}${TERMS_USE_ENDPOINTS.TERMS_USE.replace('{page}', page)}`;

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

        return this.http.get<TermsUseResponseDto>(url, { params });
    }

    getTermsUseById(id: string): Observable<GetTermsUseByIdResponseDto> {
        return this.http.get<GetTermsUseByIdResponseDto>(
            `${this.baseUrl}${TERMS_USE_ENDPOINTS.GET_BY_ID.replace('{id}', id)}`
        );
    }

    createTermsUse(payload: FormData): Observable<SimpleResponseDto<void>> {
        return this.http.post<SimpleResponseDto<void>>(
            `${this.baseUrl}${TERMS_USE_ENDPOINTS.CREATE}`,
            payload
        );
    }

    updateTermsUse(
        id: string,
        payload: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.http.post<SimpleResponseDto<void>>(
            `${this.baseUrl}${TERMS_USE_ENDPOINTS.UPDATE.replace('{id}', id)}`,
            payload
        );
    }

    deleteTermsUse(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.delete<SimpleResponseDto<void>>(
            `${this.baseUrl}${TERMS_USE_ENDPOINTS.DELETE.replace('{id}', id)}`
        );
    }

    publishTermsUse(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.put<SimpleResponseDto<void>>(
            `${this.baseUrl}${TERMS_USE_ENDPOINTS.PUBLISH.replace('{id}', id)}`,
            {}
        );
    }

    unpublishTermsUse(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.put<SimpleResponseDto<void>>(
            `${this.baseUrl}${TERMS_USE_ENDPOINTS.UNPUBLISH.replace('{id}', id)}`,
            {}
        );
    }
}
