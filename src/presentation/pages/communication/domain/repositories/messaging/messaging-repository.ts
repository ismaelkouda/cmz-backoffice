import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

export abstract class MessagingRepository {
    abstract readAll(
        contract: MessagingFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MessagingEntity>>;
    abstract create(
        entity: MessagingCreateEntity
    ): Observable<MessageResponseDto>;
    abstract update(
        entity: MessagingUpdateEntity
    ): Observable<MessageResponseDto>;
    abstract delete(
        entity: MessagingDeleteEntity
    ): Observable<MessageResponseDto>;
    abstract enable(
        entity: MessagingEnableEntity
    ): Observable<MessageResponseDto>;
    abstract disable(
        entity: MessagingDisableEntity
    ): Observable<MessageResponseDto>;
}
