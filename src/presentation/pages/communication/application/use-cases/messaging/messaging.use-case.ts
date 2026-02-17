import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';

import { MessagingCreateDto } from '@presentation/pages/communication/application/dto/messaging/messaging-create.dto';
import { MessagingDeleteDto } from '@presentation/pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDisableDto } from '@presentation/pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingEnableDto } from '@presentation/pages/communication/application/dto/messaging/messaging-enable.dto';
import { MessagingFilterDto } from '@presentation/pages/communication/application/dto/messaging/messaging-filter.dto';
import { MessagingUpdateDto } from '@presentation/pages/communication/application/dto/messaging/messaging-update.dto';
import { MessagingCreateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingUpdateEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@presentation/pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@presentation/pages/communication/domain/repositories/messaging/messaging-repository';
import { MessagingCreateVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-create.vo';
import { MessagingDeleteVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-delete.vo';
import { MessagingDisableVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-disable.vo';
import { MessagingEnableVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-enable.vo';
import { MessagingFilterVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-filter.vo';
import { MessagingUpdateVo } from '@presentation/pages/communication/domain/value-objects/messaging/messaging-update.vo';

@Injectable({
    providedIn: 'root',
})
export class MessagingUseCase {
    private readonly repository = inject(MessagingRepository);

    execute(
        dto: MessagingFilterDto | null,
        page: string
    ): Observable<Paginate<MessagingEntity>> {
        const vo = MessagingFilterVo.fromDto(dto);
        const entity = MessagingFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page);
    }

    create(dto: MessagingCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = MessagingCreateVo.fromDto(dto);
        const entity = MessagingCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: MessagingUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = MessagingUpdateVo.fromDto(dto);
        const entity = MessagingUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(dto: MessagingEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = MessagingEnableVo.fromDto(dto);
        const entity = MessagingEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: MessagingDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = MessagingDisableVo.fromDto(dto);
        const entity = MessagingDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(dto: MessagingDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = MessagingDeleteVo.fromDto(dto);
        const entity = MessagingDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
