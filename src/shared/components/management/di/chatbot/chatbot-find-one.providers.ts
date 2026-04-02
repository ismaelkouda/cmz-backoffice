import { Provider } from '@angular/core';
import { ChatbotFindOneRepository } from '@shared/components/management/domain/repositories/chatbot/chatbot-find-one-repository';
import { ChatbotFindOneRepositoryImpl } from '@shared/components/management/infrastructure/data/repositories/chatbot/chatbot-find-one-repository.impl';

export const chatbotFindOneProviders: Provider[] = [
    {
        provide: ChatbotFindOneRepository,
        useClass: ChatbotFindOneRepositoryImpl,
    },
];
