import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvService } from '../../../../../../shared/services/env.service';
import {
    BehaviorSubject,
    catchError,
    debounceTime,
    finalize,
    Observable,
    of,
    switchMap,
} from 'rxjs';
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

    private loadingReadAllNotificationSubject = new BehaviorSubject<boolean>(
        false
    );

    fetchReadAllNotifications(): void {
        if (this.loadingReadAllNotificationSubject.getValue()) return;
        this.loadingReadAllNotificationSubject.next(true);
        const url: string =
            notificationsCenterEndpointEnum.SUPERVISION_OPERATIONS_CENTRE_NOTIFICATIONS_READ_ALL;
        this.http
            .put(`${this.BASE_URL}${url}`, {})
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    return of(response);
                }),
                catchError((error) => {
                    console.error(
                        'Error fetching readAll notifications',
                        error
                    );
                    return of([]);
                }),
                finalize(() =>
                    this.loadingReadAllNotificationSubject.next(false)
                )
            )
            .subscribe();
    }

    isLoadingReadAllNotifications(): Observable<boolean> {
        return this.loadingReadAllNotificationSubject.asObservable();
    }
}
