import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { NotificationsFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-filter-api.dto';
import { NotificationsReadOneApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-read-one-api.dto';
import { NotificationsResponseApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-response-api.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(COMMUNICATION_BASE_URL);

    execute(
        filter: NotificationsFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<NotificationsResponseApiDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}?page=${page}`;

        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<NotificationsResponseApiDto>(url, {
            params,
            context,
        });
    }

    readOne(
        apiDto: NotificationsReadOneApiDto
    ): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}/${apiDto.uniq_id}/read`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}/read-all`;
        return this.http.put<SimpleResponseDto<void>>(url, {});
    }
}
