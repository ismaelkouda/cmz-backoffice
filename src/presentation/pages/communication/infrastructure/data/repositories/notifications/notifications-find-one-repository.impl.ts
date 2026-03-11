import { inject, Injectable } from '@angular/core';
import { NotificationsFindOneFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one-filter.entity';
import { NotificationsFindOneEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { NotificationsFindOneRepository } from '@pages/communication/domain/repositories/notifications/notifications-find-one.repository';
import { agentsPerformancesFindOneFilterMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-find-one-filter.mapper';
import { NotificationsFindOneMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-find-one.mapper';
import { NotificationsFindOneApi } from '@pages/communication/infrastructure/data/sources/notifications/notifications-find-one.api';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsFindOneRepositoryImpl implements NotificationsFindOneRepository {
    private readonly api = inject(NotificationsFindOneApi);
    private readonly mapper = inject(NotificationsFindOneMapper);

    execute(
        filter: NotificationsFindOneFilterEntity,
        page: string
    ): Observable<Paginate<NotificationsFindOneEntity>> {
        const paramsDto = agentsPerformancesFindOneFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
