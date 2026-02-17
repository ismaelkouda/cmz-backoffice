import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { buildHttpParams } from '@shared/domain/utils/build-http-params.utils';

import { COMMUNICATION_BASE_URL } from '@presentation/pages/communication/infrastructure/api/communication.base-url';
import { COMMUNICATION_ENDPOINTS } from '@presentation/pages/communication/infrastructure/api/communication.endpoints';
import { NotificationsFilterApiDto } from '@presentation/pages/communication/infrastructure/api/dto/notifications/notifications-filter-api.dto';
import { NotificationsResponseApiDto } from '@presentation/pages/communication/infrastructure/api/dto/notifications/notifications-response-api.dto';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
    constructor(
        private readonly http: HttpClient,
        @Inject(COMMUNICATION_BASE_URL) private readonly baseUrl: string
    ) {}

    execute(
        filter: NotificationsFilterApiDto,
        page: string
    ): Observable<NotificationsResponseApiDto> {
        const url = `${this.baseUrl}${COMMUNICATION_ENDPOINTS.NOTIFICATIONS}?page=${page}`;

        const params = buildHttpParams(filter);

        return this.http.get<NotificationsResponseApiDto>(url, { params });
    }
}
