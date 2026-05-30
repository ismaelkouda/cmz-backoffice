import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CONTENT_MANAGEMENT_BASE_URL } from '@pages/content-management/infrastructure/api/content-management.base-url';
import { CONTENT_MANAGEMENT_ENDPOINTS } from '@pages/content-management/infrastructure/api/content-management.endpoints';
import { HomeCreateApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-create-api.dto';
import { HomeDeleteApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-delete-api.dto';
import { HomeDisableApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-disable-api.dto';
import { HomeEnableApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-enable-api.dto';
import { HomeFilterApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-filter-api.dto';
import { HomeResponseApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-response-api.dto';
import { HomeUpdateApiDto } from '@pages/content-management/infrastructure/api/dto/home/home-update-api.dto';
import { formDataBuilder } from '@shared/constants/formDataBuilder.constant';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { buildHttpPayload } from '@shared/domain/utils/build-http-payload.util';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HomeApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(CONTENT_MANAGEMENT_BASE_URL);

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
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    update(apiDto: HomeUpdateApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${apiDto.uniq_id}/update`;
        const payload = buildHttpPayload(apiDto, ['uniq_id']);
        const formData = formDataBuilder(payload);
        return this.http.post<SimpleResponseDto<void>>(url, formData);
    }

    delete(apiDto: HomeDeleteApiDto): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${CONTENT_MANAGEMENT_ENDPOINTS.HOME}/${apiDto.uniq_id}/delete`;
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
