import { Observable } from 'rxjs';

import { MessagingFindOneFilterEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-find-one.entity';

export abstract class MessagingFindOneRepository {
    abstract read(
        filter: MessagingFindOneFilterEntity
    ): Observable<MessagingFindOneEntity>;
}
