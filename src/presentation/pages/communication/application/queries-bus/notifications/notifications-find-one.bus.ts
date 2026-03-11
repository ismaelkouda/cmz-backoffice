import { Injectable } from '@angular/core';
import { NotificationsFindOneQuery } from '@pages/communication/application/queries/notifications/notifications-find-one.query';
import { NotificationsFindOneHandler } from '@pages/communication/application/queries-handlers/notifications/notifications-find-one.handler';
import { NotificationsFindOneEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneBus {
    constructor(private readonly filterHandler: NotificationsFindOneHandler) {}

    dispatch<T>(
        query: T,
        page: string
    ): Observable<Paginate<NotificationsFindOneEntity>> {
        if (query instanceof NotificationsFindOneQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
