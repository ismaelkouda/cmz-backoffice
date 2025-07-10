import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { EncodingDataService } from './encoding-data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CurrentUser } from '../interfaces/current-user.interface';

@Injectable({
    providedIn: 'root',
})
export class NotifyService {
    public baseUrl: string;

    constructor(
        private http: HttpClient,
        private socket$: WebSocketSubject<any>,
        private encodingService: EncodingDataService
    ) {
        const data: CurrentUser | null =
            this.encodingService.getData('user_data');
        this.baseUrl = `${data?.tenant?.url_backend}/api/v1/`;
    }

    send(data: any): void {
        this.socket$.next(data);
    }
    onData() {
        return this.socket$.asObservable();
    }
    OncountNotify(): Observable<any> {
        const url: string = <string>'centre-notifications/count-unread';
        return this.http.post(`${this.baseUrl}${url}`, {});
    }
}
