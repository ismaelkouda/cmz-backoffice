import { MessagingFindOneFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one-filter.entity';
import { MessagingFindOneEntity } from '@pages/communication/domain/entities/messaging/messaging-find-one.entity';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MessagingFindOneRepository {
    abstract read(
        filter: MessagingFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<MessagingFindOneEntity>;
}
