import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class NotificationsRepository {
    abstract execute(
        filter: NotificationsFilterEntity | null,
        page: string
    ): Observable<Paginate<NotificationsEntity>>;
    abstract readAll(): Observable<SimpleResponseDto<void>>;
}
