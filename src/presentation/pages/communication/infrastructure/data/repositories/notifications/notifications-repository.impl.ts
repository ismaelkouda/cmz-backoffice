import { inject, Injectable } from '@angular/core';
import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsRepository } from '@pages/communication/domain/repositories/notifications/notifications.repository';
import { NotificationsFilterMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-filter.mapper';
import { notificationsReadOneMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications-read-one.mapper';
import { NotificationsMapper } from '@pages/communication/infrastructure/data/mappers/notifications/notifications.mapper';
import { NotificationsApi } from '@pages/communication/infrastructure/data/sources/notifications/notifications.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryImpl implements NotificationsRepository {
    private readonly api = inject(NotificationsApi);
    private readonly mapper = inject(NotificationsMapper);
    private readonly filterMapper = inject(NotificationsFilterMapper);

    execute(
        entity: NotificationsFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>> {
        const paramsDto = this.filterMapper.map(entity);
        return this.api
            .execute(paramsDto, page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    readOne(dto: NotificationsReadOneDto): Observable<SimpleResponseDto<void>> {
        return this.api.readOne(notificationsReadOneMapper(dto));
    }

    readAll(): Observable<SimpleResponseDto<void>> {
        return this.api.readAll();
    }
}
