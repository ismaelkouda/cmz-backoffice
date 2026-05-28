import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { COMMUNICATION_BASE_URL } from '@pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@pages/communication/infrastructure/api/communication.endpoints';
import { NotificationsFindOneFilterApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-find-one-filter-api.dto';
import { NotificationsFindOneResponseApiDto } from '@pages/communication/infrastructure/api/dto/notifications/notifications-find-one-response-api.dto';
import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(COMMUNICATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: NotificationsFindOneFilterApiDto,
        page: string
    ): Observable<NotificationsFindOneResponseApiDto> {
        const url = `${this.baseUrl}${filter.uniq_id}/${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.put<NotificationsFindOneResponseApiDto>(url, {
            params,
        });
    }
}
