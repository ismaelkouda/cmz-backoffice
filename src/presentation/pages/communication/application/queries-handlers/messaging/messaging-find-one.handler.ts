import { Injectable, inject } from '@angular/core';
import { messagingFindOneQueryMapper } from '@pages/communication/application/queries-mappers/messaging/messaging-find-one.mapper';
import { MessagingFindOneQuery } from '@pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneUseCase } from '@pages/communication/application/use-cases/messaging/messaging-find-one.use-case';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneHandler {
    private readonly useCase = inject(MessagingFindOneUseCase);

    execute(
        command: MessagingFindOneQuery,
        options?: FetchOptions
    ): Observable<MessagingFindOneEntity> {
        return this.useCase.execute(
            messagingFindOneQueryMapper(command),
            options
        );
    }
}
