import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MessagingFindOneQuery } from '@presentation/pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneHandler } from '@presentation/pages/communication/application/queries-handlers/messaging/messaging-find-one.handler';
import { MessagingFindOneEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneBus {
    constructor(private readonly filterHandler: MessagingFindOneHandler) {}

    dispatch<T>(query: T): Observable<MessagingFindOneEntity> {
        if (query instanceof MessagingFindOneQuery) {
            return this.filterHandler.execute(query);
        }

        throw new Error('No handler found for query');
    }
}
