import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetLegalNoticeByIdResponseDto } from '@presentation/pages/content-management/core/application/dtos/legal-notice/get-legal-notice-by-id-response.dto';
import { LegalNoticeRequestDto } from '@presentation/pages/content-management/core/application/dtos/legal-notice/legal-notice-request.dto';
import { LegalNoticeResponseDto } from '@presentation/pages/content-management/core/application/dtos/legal-notice/legal-notice-response.dto';
import { LEGAL_NOTICE_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/data/endpoints/legal-notice-endpoints';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LegalNoticeApi {
    private readonly baseUrl = this.envService.settingUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) { }

    fetchLegalNotice(
        payload: LegalNoticeRequestDto,
        page: string
    ): Observable<LegalNoticeResponseDto> {
        const url = `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.LEGAL_NOTICE.replace('{page}', page)}`;

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

        return this.http.get<LegalNoticeResponseDto>(url, { params });
    }

    getLegalNoticeById(id: string): Observable<GetLegalNoticeByIdResponseDto> {
        return this.http.get<GetLegalNoticeByIdResponseDto>(
            `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.GET_BY_ID.replace('{id}', id)}`
        );
    }

    createLegalNotice(payload: FormData): Observable<SimpleResponseDto<void>> {
        return this.http.post<SimpleResponseDto<void>>(
            `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.CREATE}`,
            payload
        );
    }

    updateLegalNotice(
        id: string,
        payload: FormData
    ): Observable<SimpleResponseDto<void>> {
        return this.http.post<SimpleResponseDto<void>>(
            `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.UPDATE.replace('{id}', id)}`,
            payload
        );
    }

    deleteLegalNotice(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.delete<SimpleResponseDto<void>>(
            `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.DELETE.replace('{id}', id)}`
        );
    }

    publishLegalNotice(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.put<SimpleResponseDto<void>>(
            `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.PUBLISH.replace('{id}', id)}`,
            {}
        );
    }

    unpublishLegalNotice(id: string): Observable<SimpleResponseDto<void>> {
        return this.http.put<SimpleResponseDto<void>>(
            `${this.baseUrl}${LEGAL_NOTICE_ENDPOINTS.UNPUBLISH.replace('{id}', id)}`,
            {}
        );
    }
}
