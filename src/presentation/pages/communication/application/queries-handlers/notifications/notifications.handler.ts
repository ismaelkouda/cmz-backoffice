import { Injectable } from '@angular/core';
import { NotificationsQuery } from '@pages/communication/application/queries/notifications/notifications.query';
import { NotificationsUseCase } from '@pages/communication/application/use-cases/notifications/notifications.use-case';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
