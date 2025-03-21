import { Observable, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, debounceTime, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { EnvService } from '../../../../../../shared/services/env.service';
import { Paginate } from '../../../../../../shared/interfaces/paginate';
import { notificationsCenterEndpointEnum } from '../enums/notifications-center-endpoint.enum';
import { notificationsCenterFilterInterface } from '../interfaces/notifications-center-filter.interface';
import { Folder } from '../../../../../../shared/interfaces/folder';
import { notificationsCenterApiResponseInterface, notificationsCenterInterface } from '../interfaces/notifications-center.interface';

@Injectable()

export class NotificationsCenterApiService {
    private notificationsCenterSubject = new BehaviorSubject<Array<notificationsCenterInterface>>([]);
    private notificationsCenterPagination = new BehaviorSubject<Paginate<notificationsCenterInterface>>({} as Paginate<notificationsCenterInterface>);
    private notificationsCenterSelected = new BehaviorSubject<notificationsCenterInterface>({} as notificationsCenterInterface);
    private loadingNotificationsCenterSubject = new BehaviorSubject<boolean>(false);
    private dataFilterNotificationsCenterSubject = new BehaviorSubject<notificationsCenterFilterInterface>({} as notificationsCenterFilterInterface);
    private dataNbrPageNotificationsCenterSubject = new BehaviorSubject<string>('1');
    private apiResponseNotificationsCenterSubject = new BehaviorSubject<notificationsCenterApiResponseInterface>({} as notificationsCenterApiResponseInterface);

    private BASE_URL: string;
    constructor(private http: HttpClient, private envService: EnvService) {
        this.BASE_URL = this.envService.apiUrl;
    }

    /*********************Méthode pour récupérer la liste notificationsCenter*************** */
    fetchNotificationsCenter(data: notificationsCenterFilterInterface, nbrPage: string = '1'): void {
        if (this.loadingNotificationsCenterSubject.getValue()) return;
        this.loadingNotificationsCenterSubject.next(true);
        const url: string = notificationsCenterEndpointEnum.SUPERVISION_OPERATIONS_CENTRE_NOTIFICATIONS_ALL.replace('{page}', nbrPage);

        this.http
            .post<Object>(this.BASE_URL + url, data)
            .pipe(
                debounceTime(500),
                switchMap((response: any) => {
                    const notificationsCenter = response?.['data']?.data;
                    this.notificationsCenterSubject.next(notificationsCenter);
                    this.notificationsCenterPagination.next(response?.['data']);
                    this.apiResponseNotificationsCenterSubject.next(response);
                    this.dataFilterNotificationsCenterSubject.next(data);
                    this.dataNbrPageNotificationsCenterSubject.next(nbrPage);
                    return of(response);
                }),
                catchError((error) => {
                    console.error('Error fetching notificationsCenter', error);
                    return of([]);
                }),
                finalize(() => this.loadingNotificationsCenterSubject.next(false))
            )
            .subscribe();
    }

    getNotificationsCenter(): Observable<Array<notificationsCenterInterface>> {
        return this.notificationsCenterSubject.asObservable();
    }
    getNotificationsCenterPagination(): Observable<Paginate<notificationsCenterInterface>> {
        return this.notificationsCenterPagination.asObservable();
    }
    isLoadingNotificationsCenter(): Observable<boolean> {
        return this.loadingNotificationsCenterSubject.asObservable();
    }
    getDataFilterNotificationsCenter(): Observable<notificationsCenterFilterInterface> {
        return this.dataFilterNotificationsCenterSubject.asObservable();
    }
    getDataNbrPageNotificationsCenter(): Observable<string> {
        return this.dataNbrPageNotificationsCenterSubject.asObservable();
    }
    getApiResponseNotificationsCenter(): Observable<notificationsCenterApiResponseInterface> {
        return this.apiResponseNotificationsCenterSubject.asObservable();
    }
    getNotificationsCenterSelected(): Observable<notificationsCenterInterface> {
        return this.notificationsCenterSelected.asObservable();
    }
    setNotificationsCenterSelected(notificationsCenter: notificationsCenterInterface): void {
        this.notificationsCenterSelected.next(notificationsCenter);
    }

    deleteNotificationsSelected(data): Observable<any> {
        const url: string = (<string>notificationsCenterEndpointEnum.SUPERVISION_OPERATIONS_CENTRE_NOTIFICATIONS_READ);
        return this.http.put(`${this.BASE_URL}${url}`, data);
    }
}
