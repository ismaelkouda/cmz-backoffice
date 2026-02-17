import { Observable } from 'rxjs';

import { Paginate } from '@shared/data/dto/simple-response.dto';

import { NotificationsFindOneFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-find-one-filter.entity';
import { NotificationsFindOneEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-find-one.entity';

export abstract class NotificationsFindOneRepository {
    abstract execute(
        filter: NotificationsFindOneFilterEntity,
        page: string
    ): Observable<Paginate<NotificationsFindOneEntity>>;
}
