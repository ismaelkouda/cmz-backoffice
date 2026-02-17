import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsQuery } from '@presentation/pages/communication/application/queries/notifications/notifications.query';
import { NotificationsHandler } from '@presentation/pages/communication/application/queries-handlers/notifications/notifications.handler';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';

@Injectable({ providedIn: 'root' })
export class NotificationsBus {
    constructor(private readonly filterHandler: NotificationsHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        if (query instanceof NotificationsQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
