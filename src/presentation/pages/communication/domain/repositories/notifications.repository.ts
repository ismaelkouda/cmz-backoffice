import { NotificationsEntity } from '@presentation/pages/communication/domain/entities/notifications.entity';
import { Paginate } from '@shared/data/dtos/simple-response.dto';
import { Observable } from 'rxjs';
import { NotificationsFilter } from '../value-objects/notifications-filter.vo';

export abstract class NotificationsRepository {
    abstract fetchNotifications(
        filter: NotificationsFilter | null,
        page: string
    ): Observable<Paginate<NotificationsEntity>>;

    abstract fetchReadOne(id: string): Observable<void>;

    abstract fetchReadAll(ids: string[]): Observable<void>;
}
