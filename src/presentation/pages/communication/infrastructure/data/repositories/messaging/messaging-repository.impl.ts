import { inject, Injectable } from '@angular/core';
import { MessagingCreateEntity } from '@pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingUpdateEntity } from '@pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@pages/communication/domain/repositories/messaging/messaging-repository';
import { messagingCreateMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-create.mapper';
import { messagingDeleteMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-delete.mapper';
import { messagingDisableMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-disable.mapper';
import { messagingEnableMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-enable.mapper';
import { messagingFilterMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-filter.mapper';
import { messagingUpdateMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-update.mapper';
import { MessagingMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging.mapper';
import { MessagingApi } from '@pages/communication/infrastructure/data/sources/messaging/messaging.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessagingRepositoryImpl implements MessagingRepository {
    private readonly api = inject(MessagingApi);
    private readonly mapper = inject(MessagingMapper);

    readAll(
        filter: MessagingFilterEntity,
        page: string
    ): Observable<Paginate<MessagingEntity>> {
        return this.api
            .readAll(messagingFilterMapper(filter), page)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: MessagingCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(messagingCreateMapper(payload));
    }

    update(
        payload: MessagingUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(messagingUpdateMapper(payload));
    }

    delete(entity: MessagingDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(messagingDeleteMapper(entity));
    }

    enable(entity: MessagingEnableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.enable(messagingEnableMapper(entity));
    }

    disable(
        entity: MessagingDisableEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.disable(messagingDisableMapper(entity));
    }
}
