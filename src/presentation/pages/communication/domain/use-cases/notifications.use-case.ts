import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dtos/simple-response.dto';

import { NotificationsEntity } from '../entities/notifications.entity';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { NotificationsFilter } from '../value-objects/notifications-filter.vo';

@Injectable({ providedIn: 'root' })
export class NotificationsUseCase {
    private readonly notificationsRepository = inject(NotificationsRepository);

    execute(
        filter: NotificationsFilter | null,
        page: string
    ): Observable<Paginate<NotificationsEntity>> {
        return this.notificationsRepository.fetchNotifications(filter, page);
    }

    executeReadOne(id: string): Observable<void> {
        return this.notificationsRepository.fetchReadOne(id);
    }

    executeReadAll(ids: string[]): Observable<void> {
        return this.notificationsRepository.fetchReadAll(ids);
    }
}
