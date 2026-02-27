import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';

import { CONTENT_MANAGEMENT_BASE_URL } from '@presentation/pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@presentation/pages/content-management/infrastructure/api/content-management.endpoints';
import { HomeCreateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-create-api.dto';
import { HomeDeleteApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-delete-api.dto';
import { HomeDisableApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-disable-api.dto';
import { HomeEnableApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-enable-api.dto';
import { HomeFilterApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-filter-api.dto';
import { HomeResponseApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-response-api.dto';
import { HomeUpdateApiDto } from '@presentation/pages/content-management/infrastructure/api/dto/home/home-update-api.dto';

@Injectable({ providedIn: 'root' })
export class HomeApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(CONTENT_MANAGEMENT_BASE_URL) private readonly baseUrl: string
    ) {}

    readAll(
        filter: HomeFilterApiDto,
        page: string
    ): Observable<HomeResponseApiDto> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<HomeResponseApiDto>(url, {
            params,
        });
    }

    create(apiDto: HomeCreateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/store`;
        const payload = buildHttpPayload(apiDto, []);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    update(apiDto: HomeUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${apiDto.uniq_id}/update`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        return this.http.post<SimpleResponseDto<void>>(url, payload);
    }

    delete(apiDto: HomeDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${apiDto.uniq_id}/delete`;
        console.log('url', url);
        return this.http.delete<SimpleResponseDto<void>>(url);
    }

    enable(apiDto: HomeEnableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${apiDto.uniq_id}/enable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    disable(apiDto: HomeDisableApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${apiDto.uniq_id}/disable`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
