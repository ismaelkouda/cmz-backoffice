import { NotificationsReadOneDto } from '@pages/communication/application/dto/notifications/notifications-read-one.dto';
import { NotificationsEntity } from '@pages/communication/domain/entities/notifications/notifications.entity';
import { NotificationsFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-filter.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class NotificationsRepository {
    abstract execute(
        entity: NotificationsFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsEntity>>;
    abstract readOne(
        dto: NotificationsReadOneDto
    ): Observable<SimpleResponseDto<void>>;
    abstract readAll(): Observable<SimpleResponseDto<void>>;
}
