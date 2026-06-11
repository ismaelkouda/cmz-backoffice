import { NotificationsFindOneFilterEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one-filter.entity';
import { NotificationsFindOneEntity } from '@pages/communication/domain/entities/notifications/notifications-find-one.entity';
import { Paginate } from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class NotificationsFindOneRepository {
    abstract execute(
        filter: NotificationsFindOneFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<NotificationsFindOneEntity>>;
}
