import { Injectable, inject } from '@angular/core';
import { NotificationsQuery } from '@pages/communication/application/queries/notifications/notifications.query';
import { NotificationsUseCase } from '@pages/communication/application/use-cases/notifications/notifications.use-case';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsHandler {
    private readonly useCase = inject(NotificationsUseCase);

    execute(
        query: NotificationsQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>> {
        return this.useCase.execute(
            {
                search: query.search,
                type: query.type,
                startDate: query.startDate,
                endDate: query.endDate,
            },
            page,
            options
        );
    }
}
