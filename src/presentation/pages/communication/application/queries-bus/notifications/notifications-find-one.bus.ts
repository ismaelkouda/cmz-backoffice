import { Injectable, inject } from '@angular/core';
import { NotificationsFindOneQuery } from '@pages/communication/application/queries/notifications/notifications-find-one.query';
import { NotificationsFindOneHandler } from '@pages/communication/application/queries-handlers/notifications/notifications-find-one.handler';
import { NotificationsFindOneEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';
import { FetchOptions } from '@shared/interface/fetch-options.interface';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneBus {
    private readonly filterHandler = inject(NotificationsFindOneHandler);

    dispatch<T>(
        query: T,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsFindOneEntity>> {
        if (query instanceof NotificationsFindOneQuery) {
            return this.filterHandler.execute(query, page, options);
        }

        throw new Error('No handler found for query');
    }
}
