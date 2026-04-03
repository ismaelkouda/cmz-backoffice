import { Injectable } from '@angular/core';
import { ChatbotFindOneQuery } from '@shared/components/management/application/queries/chatbot/chatbot-find-one.query';
import { ChatbotFindOneUseCase } from '@shared/components/management/application/use-cases/chatbot/chatbot-find-one.use-case';
import { ChatbotFindOneEntity } from '@shared/components/management/domain/entities/chatbot/chatbot-find-one.entity';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatbotFindOneHandler {
    constructor(private readonly useCase: ChatbotFindOneUseCase) {}

    execute(command: ChatbotFindOneQuery): Observable<ChatbotFindOneEntity> {
        return this.useCase.execute({
            uniqId: command.uniqId,
        });
    }
}
