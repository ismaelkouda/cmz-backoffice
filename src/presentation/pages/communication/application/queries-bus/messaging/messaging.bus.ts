import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { MessagingQuery } from '@presentation/pages/communication/application/queries/messaging/messaging.query';
import { MessagingHandler } from '@presentation/pages/communication/application/queries-handlers/messaging/messaging.handler';
import { MessagingEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging.entity';

@Injectable({ providedIn: 'root' })
export class MessagingBus {
    constructor(private readonly filterHandler: MessagingHandler) {}

    dispatch<T>(query: T, page: string): Observable<Paginate<MessagingEntity>> {
        if (query instanceof MessagingQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
