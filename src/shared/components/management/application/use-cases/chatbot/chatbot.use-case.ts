import { inject, Injectable } from '@angular/core';
import { ChatbotCreateDto } from '@shared/components/management/application/dto/chatbot/chatbot-create.dto';
import { ChatbotDeleteDto } from '@shared/components/management/application/dto/chatbot/chatbot-delete.dto';
import { ChatbotDisableDto } from '@shared/components/management/application/dto/chatbot/chatbot-disable.dto';
import { ChatbotEnableDto } from '@shared/components/management/application/dto/chatbot/chatbot-enable.dto';
import { ChatbotFilterDto } from '@shared/components/management/application/dto/chatbot/chatbot-filter.dto';
import { ChatbotUpdateDto } from '@shared/components/management/application/dto/chatbot/chatbot-update.dto';
import { ChatbotCreateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-create.entity';
import { ChatbotDeleteEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-delete.entity';
import { ChatbotDisableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-disable.entity';
import { ChatbotEnableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-enable.entity';
import { ChatbotFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-filter.entity';
import { ChatbotUpdateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-update.entity';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import { ChatbotRepository } from '@shared/components/management/domain/repositories/chatbot/chatbot-repository';
import { ChatbotCreateVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-create.vo';
import { ChatbotDeleteVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-delete.vo';
import { ChatbotDisableVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-disable.vo';
import { ChatbotEnableVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-enable.vo';
import { ChatbotFilterVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-filter.vo';
import { ChatbotUpdateVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-update.vo';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatbotUseCase {
    private readonly repository = inject(ChatbotRepository);

    execute(
        dto: ChatbotFilterDto | null,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ChatbotEntity>> {
        const vo = ChatbotFilterVo.fromDto(dto);
        const entity = ChatbotFilterEntity.fromVo(vo);
        return this.repository.readAll(entity, page, options);
    }

    create(dto: ChatbotCreateDto): Observable<SimpleResponseDto<void>> {
        const vo = ChatbotCreateVo.fromDto(dto);
        const entity = ChatbotCreateEntity.fromVo(vo);
        return this.repository.create(entity);
    }

    update(dto: ChatbotUpdateDto): Observable<SimpleResponseDto<void>> {
        const vo = ChatbotUpdateVo.fromDto(dto);
        const entity = ChatbotUpdateEntity.fromVo(vo);
        return this.repository.update(entity);
    }

    enable(dto: ChatbotEnableDto): Observable<SimpleResponseDto<void>> {
        const vo = ChatbotEnableVo.fromDto(dto);
        const entity = ChatbotEnableEntity.fromVo(vo);
        return this.repository.enable(entity);
    }

    disable(dto: ChatbotDisableDto): Observable<SimpleResponseDto<void>> {
        const vo = ChatbotDisableVo.fromDto(dto);
        const entity = ChatbotDisableEntity.fromVo(vo);
        return this.repository.disable(entity);
    }

    delete(dto: ChatbotDeleteDto): Observable<SimpleResponseDto<void>> {
        const vo = ChatbotDeleteVo.fromDto(dto);
        const entity = ChatbotDeleteEntity.fromVo(vo);
        return this.repository.delete(entity);
    }
}
