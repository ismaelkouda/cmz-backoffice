import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { COMMUNICATION_BASE_URL } from '@presentation/pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@presentation/pages/communication/infrastructure/api/communication.endpoints';
import { NotificationsFindOneFilterApiDto } from '@presentation/pages/communication/infrastructure/api/dto/notifications/notifications-find-one-filter-api.dto';
import { NotificationsFindOneResponseApiDto } from '@presentation/pages/communication/infrastructure/api/dto/notifications/notifications-find-one-response-api.dto';

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
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}/${filter.uniq_id}?page=${page}`;
        const params = buildHttpParams(filter);
        return this.http.get<NotificationsFindOneResponseApiDto>(url, {
            params,
        });
    }
}
