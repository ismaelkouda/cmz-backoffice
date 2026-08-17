import { Injectable, inject } from '@angular/core';
import { notificationsFindOneQueryMapper } from '@pages/communication/application/queries-mappers/notifications/notifications-find-one.mapper';
import { NotificationsFindOneQuery } from '@pages/communication/application/queries/notifications/notifications-find-one.query';
import { NotificationsFindOneUseCase } from '@pages/communication/application/use-cases/notifications/notifications-find-one.use-case';
import { NotificationsFindOneEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneHandler {
    private readonly useCase = inject(NotificationsFindOneUseCase);

    execute(
        query: NotificationsFindOneQuery,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsFindOneEntity>> {
        return this.useCase.execute(
            notificationsFindOneQueryMapper(query),
            page,
            options
        );
    }
}
