import { Injectable, inject } from '@angular/core';
import { MessagingFindOneQuery } from '@pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneHandler } from '@pages/communication/application/queries-handlers/messaging/messaging-find-one.handler';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneBus {
    private readonly filterHandler = inject(MessagingFindOneHandler);

    dispatch<T>(query: T): Observable<MessagingFindOneEntity> {
        if (query instanceof MessagingFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
