import { inject, Injectable } from '@angular/core';
import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';
import { MessagingDeleteEntity } from '@pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { messagingFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingCreateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.contract';
import { MessagingUpdateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.contract';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@pages/communication/domain/repositories/messaging/messaging-repository';
import { messagingCreateVo } from '@pages/communication/domain/value-objects/messaging/messaging-create.vo';
import { MessagingDeleteVo } from '@pages/communication/domain/value-objects/messaging/messaging-delete.vo';
import { MessagingDisableVo } from '@pages/communication/domain/value-objects/messaging/messaging-disable.vo';
import { MessagingEnableVo } from '@pages/communication/domain/value-objects/messaging/messaging-enable.vo';
import { messagingFilterVo } from '@pages/communication/domain/value-objects/messaging/messaging-filter.vo';
import { messagingUpdateVo } from '@pages/communication/domain/value-objects/messaging/messaging-update.vo';
import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';
import { messagingCreateFactory } from '@presentation/pages/communication/domain/factories/messaging/messaging-create.factory';
import { messagingUpdateFactory } from '@presentation/pages/communication/domain/factories/messaging/messaging-update.factory';

@Injectable({
    providedIn: 'root',
})
export class MessagingUseCase {
    private readonly repository = inject(MessagingRepository);

    execute(
        contract: MessagingFilterContract,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<MessagingEntity>> {
        const vo = messagingFilterVo(contract);
        const entity = messagingFilterEntity(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(contract: MessagingCreateContract): Observable<MessageResponseDto> {
        const validated = messagingCreateVo(contract);
        const entity = messagingCreateFactory(validated);
        // entity.ensureCanBeCreated();
        return this.repository.create(entity);
    }

    update(contract: MessagingUpdateContract): Observable<MessageResponseDto> {
        const validated = messagingUpdateVo(contract);
        const entity = messagingUpdateFactory(validated);
        // entity.ensureCanBeUpdated();
        return this.repository.update(entity);
    }

    enable(dto: MessagingEnableDto): Observable<MessageResponseDto> {
        const vo = MessagingEnableVo.fromDto(dto);
        const entity = MessagingEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: MessagingDisableDto): Observable<MessageResponseDto> {
        const vo = MessagingDisableVo.fromDto(dto);
        const entity = MessagingDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(dto: MessagingDeleteDto): Observable<MessageResponseDto> {
        const vo = MessagingDeleteVo.fromDto(dto);
        const entity = MessagingDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
