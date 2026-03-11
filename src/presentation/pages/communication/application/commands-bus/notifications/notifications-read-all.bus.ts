import { Injectable } from '@angular/core';
import { NotificationsReadAllHandler } from '@pages/communication/application/commands-handlers/notifications/notifications-read-all.handler';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsReadAllBus {
    constructor(private readonly filterHandler: NotificationsReadAllHandler) {}

    dispatch(): Observable<SimpleResponseDto<void>> {
        return this.filterHandler.execute();
    }
}
