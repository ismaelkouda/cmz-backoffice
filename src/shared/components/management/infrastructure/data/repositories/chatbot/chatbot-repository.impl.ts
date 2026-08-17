import { inject, Injectable } from '@angular/core';
import { ChatbotCreateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-create.entity';
import { ChatbotDeleteEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-delete.entity';
import { ChatbotDisableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-disable.entity';
import { ChatbotEnableEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-enable.entity';
import { ChatbotFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-filter.entity';
import { ChatbotUpdateEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-update.entity';
import { ChatbotEntity } from '@shared/components/management/domain/entities/chatbot/chatbot.entity';
import { ChatbotRepository } from '@shared/components/management/domain/repositories/chatbot/chatbot-repository';
import { chatbotCreateMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-create.mapper';
import { chatbotDeleteMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-delete.mapper';
import { chatbotDisableMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-disable.mapper';
import { chatbotEnableMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-enable.mapper';
import { chatbotFilterMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-filter.mapper';
import { chatbotUpdateMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-update.mapper';
import { ChatbotMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot.mapper';
import { ChatbotApi } from '@shared/components/management/infrastructure/data/sources/chatbot/chatbot.api';
import {
    Paginate,
    SimpleResponseDto,
} from '@shared/data/dto/simple-response.dto';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatbotRepositoryImpl implements ChatbotRepository {
    private readonly api = inject(ChatbotApi);
    private readonly mapper = inject(ChatbotMapper);

    readAll(
        filter: ChatbotFilterEntity,
        page: string,
        options?: FetchOptions
    ): Observable<Paginate<ChatbotEntity>> {
        return this.api
            .readAll(chatbotFilterMapper(filter), page, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }

    create(payload: ChatbotCreateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.create(chatbotCreateMapper(payload));
    }

    update(payload: ChatbotUpdateEntity): Observable<SimpleResponseDto<void>> {
        return this.api.update(chatbotUpdateMapper(payload));
    }

    delete(entity: ChatbotDeleteEntity): Observable<SimpleResponseDto<void>> {
        return this.api.delete(chatbotDeleteMapper(entity));
    }

    enable(entity: ChatbotEnableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.enable(chatbotEnableMapper(entity));
    }

    disable(entity: ChatbotDisableEntity): Observable<SimpleResponseDto<void>> {
        return this.api.disable(chatbotDisableMapper(entity));
    }
}
