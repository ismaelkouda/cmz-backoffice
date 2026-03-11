import { MessagingFindOneFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { Observable } from 'rxjs';

export abstract class MessagingFindOneRepository {
    abstract read(
        filter: MessagingFindOneFilterEntity
    ): Observable<MessagingFindOneEntity>;
}
