import { HttpClient, HttpContext } from '@angular/common/http';
import { BYPASS_CACHE } from '@core/interceptors/cache-context.token';
import { Injectable, inject } from '@angular/core';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { NotificationsFindOneFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-find-one-filter-api.dto';
import { NotificationsFindOneResponseApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-find-one-response-api.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneApi {
    private readonly http = inject(HttpClient);
    private readonly baseUrl = inject(COMMUNICATION_BASE_URL);

    execute(
        filter: NotificationsFindOneFilterApiDto,
        page: string,
        options?: FetchOptions
    ): Observable<NotificationsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${filter.uniq_id}/${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}?page=${page}`;
        const params = buildHttpParams(filter);
        const context = new HttpContext().set(
            BYPASS_CACHE,
            options?.forceRefresh ?? false
        );
        return this.http.get<NotificationsFindOneResponseApiDto>(url, {
            params,
            context,
        });
    }
}
