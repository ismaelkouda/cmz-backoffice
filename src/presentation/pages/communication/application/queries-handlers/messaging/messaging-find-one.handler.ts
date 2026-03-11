import { Injectable } from '@angular/core';
import { MessagingFindOneQuery } from '@pages/communication/application/queries/messaging/messaging-find-one.query';
import { MessagingFindOneUseCase } from '@pages/communication/application/use-cases/messaging/messaging-find-one.use-case';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { Observable } from 'rxjs';

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
