import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import { NotificationsReadOneEntity } from '@pages/communication/domain/entities/notifications/notifications-read-one.entity';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class NotificationsRepository {
    abstract execute(
        filter: NotificationsFilterEntity | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>>;
    abstract readOne(
        entity: NotificationsReadOneEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract readAll(): Observable<SimpleResponseDto<void>>;
}
