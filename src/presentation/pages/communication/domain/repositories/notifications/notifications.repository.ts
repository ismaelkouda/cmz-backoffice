import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';

export abstract class NotificationsRepository {
    abstract readAll(
        filter: NotificationsFilterEntity | null,
        page: string
    ): Observable<Paginate<NotificationsEntity>>;
}
