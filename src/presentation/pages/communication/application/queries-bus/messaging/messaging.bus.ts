import { Injectable, inject } from '@angular/core';
import { MessagingQuery } from '@pages/communication/application/queries/messaging/messaging.query';
import { MessagingHandler } from '@pages/communication/application/queries-handlers/messaging/messaging.handler';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingBus {
    private readonly filterHandler = inject(MessagingHandler);

    dispatch<T>(query: T, page: string): Observable<Paginate<MessagingEntity>> {
        if (query instanceof MessagingQuery) {
            return this.filterHandler.execute(query, page);
        }

        throw new Error('No handler found for query');
    }
}
