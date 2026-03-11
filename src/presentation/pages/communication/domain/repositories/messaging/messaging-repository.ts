import { MessagingCreateEntity } from '@pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingUpdateEntity } from '@pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

export abstract class MessagingRepository {
    abstract readAll(
        entity: MessagingFilterEntity | null,
        page: string
    ): Observable<Paginate<MessagingEntity>>;
    abstract create(
        entity: MessagingCreateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract update(
        entity: MessagingUpdateEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract delete(
        entity: MessagingDeleteEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract enable(
        entity: MessagingEnableEntity
    ): Observable<SimpleResponseDto<void>>;
    abstract disable(
        entity: MessagingDisableEntity
    ): Observable<SimpleResponseDto<void>>;
}
