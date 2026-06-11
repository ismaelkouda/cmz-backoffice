import { Injectable, inject } from '@angular/core';
import { NotificationsQuery } from '@pages/communication/application/queries/notifications/notifications.query';
import { NotificationsHandler } from '@pages/communication/application/queries-handlers/notifications/notifications.handler';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsBus {
    private readonly filterHandler = inject(NotificationsHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>> {
        if (query instanceof NotificationsQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
