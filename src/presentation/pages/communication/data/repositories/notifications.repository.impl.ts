import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsMapper } from '@presentation/pages/communication/data/mappers/notifications.mapper';
import { NotificationsApi } from '@presentation/pages/communication/data/sources/notifications.api';
import { NotificationsRepository } from '@presentation/pages/communication/domain/repositories/notifications.repository';
import { NotificationsFilter } from '@presentation/pages/communication/domain/value-objects/notifications-filter.vo';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable, catchError, map, throwError } from 'rxjs';
import { NotificationsEntity } from '../../domain/entities/notifications.entity';

@Injectable({ providedIn: 'root' })
export class NotificationsRepositoryImpl extends NotificationsRepository {
    constructor(
        private readonly api: NotificationsApi,
        private readonly notificationsMapper: NotificationsMapper,
        private readonly translateService: TranslateService
    ) {
        super();
    }

    fetchNotifications(
        filter: NotificationsFilter,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        return this.api.fetchNotifications(filter.toDto(), page).pipe(
            map((response) => this.notificationsMapper.mapFromDto(response)),
            catchError((error: unknown) =>
                throwError(
                    () =>
                        new Error(
                            error instanceof Error
                                ? error.message
                                : this.translateService.instant(
                                      'COMMUNICATION.MESSAGES.ERROR.UNABLE_TO_FETCH_NOTIFICATIONS'
                                  )
                        )
                )
            )
        );
    }

    fetchReadAll(payload: string[]): Observable<void> {
        return this.api.fetchReadAll(payload).pipe(map(() => undefined));
    }

    fetchReadOne(id: string): Observable<void> {
        return this.api.fetchReadOne(id).pipe(map(() => undefined));
    }
}
