import { inject, Injectable } from '@angular/core';
import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';
import { messagingFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingCreateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-create.contract';
import { MessagingUpdateContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-update.contract';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@pages/communication/domain/repositories/messaging/messaging-repository';
import { messagingCreateVo } from '@pages/communication/domain/value-objects/messaging/messaging-create.vo';
import { messagingDeleteVo } from '@pages/communication/domain/value-objects/messaging/messaging-delete.vo';
import { messagingDisableVo } from '@pages/communication/domain/value-objects/messaging/messaging-disable.vo';
import { messagingEnableVo } from '@pages/communication/domain/value-objects/messaging/messaging-enable.vo';
import { messagingFilterVo } from '@pages/communication/domain/value-objects/messaging/messaging-filter.vo';
import { messagingUpdateVo } from '@pages/communication/domain/value-objects/messaging/messaging-update.vo';
import { MessagingFilterContract } from '@presentation/pages/communication/domain/contracts/messaging/messaging-filter.contract';
import {
    MessageResponseDto,
    Paginate,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { defer, Observable } from 'rxjs';
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
        return defer(() => {
            const vo = messagingFilterVo(contract);
            const entity = messagingFilterEntity(vo);
            return this.repository.readAll(entity, page, options);
        });
    }

    create(contract: MessagingCreateContract): Observable<MessageResponseDto> {
        return defer(() => {
            const validated = messagingCreateVo(contract);
            const entity = messagingCreateFactory(validated);
            // entity.ensureCanBeCreated();
            return this.repository.create(entity);
        });
    }

    update(contract: MessagingUpdateContract): Observable<MessageResponseDto> {
        return defer(() => {
            const validated = messagingUpdateVo(contract);
            const entity = messagingUpdateFactory(validated);
            // entity.ensureCanBeUpdated();
            return this.repository.update(entity);
        });
    }

    enable(dto: MessagingEnableDto): Observable<MessageResponseDto> {
        return defer(() => this.repository.enable(messagingEnableVo(dto)));
    }

    disable(dto: MessagingDisableDto): Observable<MessageResponseDto> {
        return defer(() => this.repository.disable(messagingDisableVo(dto)));
    }

    delete(dto: MessagingDeleteDto): Observable<MessageResponseDto> {
        return defer(() => this.repository.delete(messagingDeleteVo(dto)));
    }
}
