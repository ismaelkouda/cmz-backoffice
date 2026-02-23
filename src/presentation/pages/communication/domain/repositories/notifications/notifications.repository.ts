import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { NotificationsFilterEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications/notifications.entity';

export abstract class NotificationsRepository {
    abstract execute(
        filter: NotificationsFilterEntity | null,
        page: string
    ): Observable<Paginate<NotificationsEntity>>;
    abstract readAll(): Observable<SimpleResponseDto<void>>;
}
