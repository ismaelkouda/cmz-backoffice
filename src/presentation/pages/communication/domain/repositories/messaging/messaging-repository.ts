import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';
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
    abstract delete(dto: MessagingDeleteDto): Observable<MessageResponseDto>;
    abstract enable(dto: MessagingEnableDto): Observable<MessageResponseDto>;
    abstract disable(dto: MessagingDisableDto): Observable<MessageResponseDto>;
}
