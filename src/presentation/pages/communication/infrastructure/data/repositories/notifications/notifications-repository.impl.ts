import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsRepository } from '@presentation/pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsFilterMapper } from '@presentation/pages/communication/infrastructure/data/mappers/notifications/notifications-filter.mapper';
import { NotificationsMapper } from '@presentation/pages/communication/infrastructure/data/mappers/notifications/notifications.mapper';
import { NotificationsApi } from '@presentation/pages/communication/infrastructure/data/sources/notifications/notifications.api';

@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryImpl implements NotificationsRepository {
    private readonly api = inject(NotificationsApi);
    private readonly mapper = inject(NotificationsMapper);

    readAll(
        filter: NotificationsFilterEntity,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        const paramsDto = NotificationsFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
