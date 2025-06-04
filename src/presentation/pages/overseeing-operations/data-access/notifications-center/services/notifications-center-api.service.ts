import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import { Observable } from 'rxjs';
import { notificationsCenterEndpointEnum } from '../enums/notifications-center-endpoint.enum';

@Injectable({
    providedIn: 'root',
})
export class NotificationsCenterApiService {
    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    ReadNotifications(data): Observable<any> {
        const url: string = <string>(
            notificationsCenterEndpointEnum.SUPERVISION_OPERATIONS_CENTRE_NOTIFICATIONS_READ
        );
        return this.http.put(`${this.BASE_URL}${url}`, data);
    }
}
