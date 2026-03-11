import { inject, Injectable } from '@angular/core';
import { MessagingCreateDto } from '@pages/communication/application/dto/messaging/messaging-create.dto';
import { MessagingDeleteDto } from '@pages/communication/application/dto/messaging/messaging-delete.dto';
import { MessagingDisableDto } from '@pages/communication/application/dto/messaging/messaging-disable.dto';
import { MessagingEnableDto } from '@pages/communication/application/dto/messaging/messaging-enable.dto';
import { MessagingFilterDto } from '@pages/communication/application/dto/messaging/messaging-filter.dto';
import { MessagingUpdateDto } from '@pages/communication/application/dto/messaging/messaging-update.dto';
import { MessagingCreateEntity } from '@pages/communication/domain/entities/messaging/messaging-create.entity';
import { MessagingDeleteEntity } from '@pages/communication/domain/entities/messaging/messaging-delete.entity';
import { MessagingDisableEntity } from '@pages/communication/domain/entities/messaging/messaging-disable.entity';
import { MessagingEnableEntity } from '@pages/communication/domain/entities/messaging/messaging-enable.entity';
import { MessagingFilterEntity } from '@pages/communication/domain/entities/messaging/messaging-filter.entity';
import { MessagingUpdateEntity } from '@pages/communication/domain/entities/messaging/messaging-update.entity';
import { MessagingEntity } from '@pages/communication/domain/entities/messaging/messaging.entity';
import { MessagingRepository } from '@pages/communication/domain/repositories/messaging/messaging-repository';
import { MessagingCreateVo } from '@pages/communication/domain/value-objects/messaging/messaging-create.vo';
import { MessagingDeleteVo } from '@pages/communication/domain/value-objects/messaging/messaging-delete.vo';
import { MessagingDisableVo } from '@pages/communication/domain/value-objects/messaging/messaging-disable.vo';
import { MessagingEnableVo } from '@pages/communication/domain/value-objects/messaging/messaging-enable.vo';
import { MessagingFilterVo } from '@pages/communication/domain/value-objects/messaging/messaging-filter.vo';
import { MessagingUpdateVo } from '@pages/communication/domain/value-objects/messaging/messaging-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { Observable } from 'rxjs';

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
