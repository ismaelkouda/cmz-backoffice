import { inject, Injectable } from '@angular/core';
import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@pages/communication/domain/repositories/messaging/messaging-repository';
import { MessagingCreateMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-create.mapper';
import { messagingDeleteMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-delete.mapper';
import { messagingDisableMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-disable.mapper';
import { messagingEnableMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-enable.mapper';
import { MessagingFilterMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-filter.mapper';
import { MessagingUpdateMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging-update.mapper';
import { MessagingMapper } from '@pages/communication/infrastructure/data/mappers/messaging/messaging.mapper';
import { MessagingApi } from '@pages/communication/infrastructure/data/sources/messaging/messaging.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessagingRepositoryImpl implements MessagingRepository {
    private readonly api = inject(MessagingApi);
    private readonly mapper = inject(MessagingMapper);
    private readonly filterMapper = inject(MessagingFilterMapper);
    private readonly createMapper = inject(MessagingCreateMapper);
    private readonly updateMapper = inject(MessagingUpdateMapper);

    readAll(
        contract: MessagingFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MessagingEntity>> {
        return this.api
            .readAll(this.filterMapper.mapFromEntity(contract), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(
        payload: MessagingCreateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.create(this.createMapper.mapFromEntity(payload));
    }

    update(
        payload: MessagingUpdateEntity
    ): Observable<SimpleResponseDto<void>> {
        return this.api.update(this.updateMapper.mapFromEntity(payload));
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
