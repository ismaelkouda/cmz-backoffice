import { inject, Injectable } from '@angular/core';
import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsReadOneEntity } from '@pages/communication/domain/entities/notifications/notifications-read-one.entity';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsRepository } from '@pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsFilterMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-filter.mapper';
import { notificationsReadOneMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-read-one.mapper';
import { NotificationsMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications.mapper';
import { NotificationsApi } from '@pages/communication/infrastructure/data/sources/notifications/notifications.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryImpl implements NotificationsRepository {
    private readonly api = inject(NotificationsApi);
    private readonly mapper = inject(NotificationsMapper);

    execute(
        filter: NotificationsFilterEntity,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        const paramsDto = NotificationsFilterMapper(filter);
        return this.api
            .execute(paramsDto, page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    readOne(
        entity: NotificationsReadOneEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.readOne(notificationsReadOneMapper(entity));
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        return this.api.readAll();
    }
}
