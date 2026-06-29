import { Injectable, inject } from '@angular/core';
import { MessagingQuery } from '@pages/communication/application/queries/messaging/messaging.query';
import { MessagingUseCase } from '@pages/communication/application/use-cases/messaging/messaging.use-case';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { messagingQueryMapper } from '@pages/communication/application/queries-mappers/messaging/messaging.mapper';

@Injectable({ providedIn: 'root' })
export class MessagingHandler {
    private readonly useCase = inject(MessagingUseCase);

    execute(
        query: MessagingQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MessagingEntity>> {
        return this.useCase.execute(messagingQueryMapper(query), page, options);
    }
}
