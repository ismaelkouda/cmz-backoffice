import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsFindOneQuery } from '@presentation/pages/communication/application/queries/notifications/notifications-find-one.query';
import { NotificationsFindOneUseCase } from '@presentation/pages/communication/application/use-cases/notifications/notifications-find-one.use-case';
import { NotificationsFindOneEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-find-one.entity';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneHandler {
    constructor(private readonly useCase: NotificationsFindOneUseCase) {}

    execute(
        query: NotificationsFindOneQuery,
        page: string
    ): Observable<Paginate<NotificationsFindOneEntity>> {
        return this.useCase.execute(
            {
                uniqId: query.uniqId,
            },
            page
        );
    }
}
