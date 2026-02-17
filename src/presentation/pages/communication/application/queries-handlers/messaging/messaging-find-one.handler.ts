import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MessagingFindOneQuery } from '@presentation/pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneUseCase } from '@presentation/pages/communication/application/use-cases/messaging/messaging-find-one.use-case';
import { MessagingFindOneEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';

@Injectable({ providedIn: 'root' })
export class MessagingFindOneHandler {
    constructor(private readonly useCase: MessagingFindOneUseCase) {}

    execute(
        command: MessagingFindOneQuery
    ): Observable<MessagingFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
