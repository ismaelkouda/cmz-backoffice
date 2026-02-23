import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

import { NotificationsReadAllHandler } from '@presentation/pages/communication/application/commands-handlers/notifications/notifications-read-all.handler';

@Injectable({ providedIn: 'root' })
export class NotificationsReadAllBus {
    constructor(private readonly filterHandler: NotificationsReadAllHandler) {}

    dispatch(): Observable<SimpleResponseDto<void>> {
        return this.filterHandler.execute();
    }
}
