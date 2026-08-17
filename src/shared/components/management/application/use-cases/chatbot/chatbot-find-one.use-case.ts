import { inject, Injectable } from '@angular/core';
import { ChatbotFindOneFilterDto } from '@shared/components/management/application/dto/chatbot/chatbot-find-one-filter.dto';
import { ChatbotFindOneFilterEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one-filter.entity';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { ChatbotFindOneRepository } from '@shared/components/management/domain/repositories/chatbot/chatbot-find-one-repository';
import { ChatbotFindOneFilterVo } from '@shared/components/management/domain/value-objects/chatbot/chatbot-find-one-filter.vo';
import { FetchOptions } from '@shared/interface/fetch-options.interface';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ChatbotFindOneUseCase {
    private readonly repository = inject(ChatbotFindOneRepository);

    execute(
        filterDto: ChatbotFindOneFilterDto,
        options?: FetchOptions
    ): Observable<ChatbotFindOneEntity> {
        const vo = ChatbotFindOneFilterVo.fromDto(filterDto);
        const filter = ChatbotFindOneFilterEntity.fromVo(vo);
        return this.repository.read(filter, options);
    }
}
