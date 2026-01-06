import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsRequestDto } from '@presentation/pages/communication/data/dtos/notifications-request.dto';
import { NotificationsResponseDto } from '@presentation/pages/communication/data/dtos/notifications-response.dto';
import { NOTIFICATIONS_ENDPOINTS } from '@presentation/pages/communication/data/endpoint/notifications.endpoints';
import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { EnvService } from '@shared/services/env.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsApi {
    private readonly baseUrl = this.envService.authenticationUrl;

    constructor(
        private readonly http: HttpClient,
        private readonly envService: EnvService
    ) {}

    fetchNotifications(
        payload: NotificationsRequestDto,
        page: string
    ): Observable<NotificationsResponseDto> {
        const url = `${this.baseUrl}${NOTIFICATIONS_ENDPOINTS.NOTIFICATIONS.replace('{page}', page)}`;
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

        return this.http.get<NotificationsResponseDto>(url, {
            params,
        });
    }

    fetchReadAll(payload: string[]): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${NOTIFICATIONS_ENDPOINTS.READ_ALL}`;
        return this.http.put<SimpleResponseDto<void>>(url, payload);
    }

    fetchReadOne(id: string): Observable<SimpleResponseDto<void>> {
        const url = `${this.baseUrl}${NOTIFICATIONS_ENDPOINTS.READ_ONE.replace('{id}', id)}`;
        return this.http.delete<SimpleResponseDto<void>>(url);
    }
}
