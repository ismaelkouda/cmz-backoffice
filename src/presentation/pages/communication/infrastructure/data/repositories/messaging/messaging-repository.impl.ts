import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@presentation/pages/communication/domain/repositories/messaging/messaging-repository';
import { messagingCreateMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-create.mapper';
import { messagingDeleteMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-delete.mapper';
import { messagingDisableMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-disable.mapper';
import { messagingEnableMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-enable.mapper';
import { messagingFilterMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-filter.mapper';
import { messagingUpdateMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging-update.mapper';
import { MessagingMapper } from '@presentation/pages/communication/infrastructure/data/mappers/messaging/messaging.mapper';
import { MessagingApi } from '@presentation/pages/communication/infrastructure/data/sources/messaging/messaging.api';

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
