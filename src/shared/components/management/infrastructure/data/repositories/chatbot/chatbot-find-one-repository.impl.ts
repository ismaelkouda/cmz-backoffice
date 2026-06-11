import { inject, Injectable } from '@angular/core';
import { ChatbotFindOneFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one-filter.entity';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { ChatbotFindOneRepository } from '@shared/components/management/domain/repositories/chatbot/chatbot-find-one-repository';
import { chatbotFindOneFilterMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-find-one-filter.mapper';
import { ChatbotFindOneMapper } from '@shared/components/management/infrastructure/data/mappers/chatbot/chatbot-find-one.mapper';
import { ChatbotFindOneApi } from '@shared/components/management/infrastructure/data/sources/chatbot/chatbot-find-one.api';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotFindOneRepositoryImpl implements ChatbotFindOneRepository {
    private readonly api = inject(ChatbotFindOneApi);
    private readonly mapper = inject(ChatbotFindOneMapper);

    read(
        filter: ChatbotFindOneFilterEntity,
        options?: FetchOptions
    ): Observable<ChatbotFindOneEntity> {
        const paramsDto = chatbotFindOneFilterMapper(filter);
        return this.api
            .read(paramsDto, options)
            .pipe(map((response) => this.mapper.mapFromDto(response)));
    }
}
