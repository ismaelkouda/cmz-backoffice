import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsQuery } from '@presentation/pages/communication/application/queries/notifications/notifications.query';
import { NotificationsUseCase } from '@presentation/pages/communication/application/use-cases/notifications/notifications.use-case';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';

@Injectable({ providedIn: 'root' })
export class NotificationsHandler {
    constructor(private readonly useCase: NotificationsUseCase) {}

    execute(
        query: NotificationsQuery,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        return this.useCase.execute(
            {
                search: query.search,
                type: query.type,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page
        );
    }
}
