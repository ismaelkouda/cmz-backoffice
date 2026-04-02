import { Provider } from '@angular/core';
import { ChatbotRepository } from '@shared/components/management/domain/repositories/chatbot/chatbot-repository';
import { ChatbotRepositoryImpl } from '@shared/components/management/infrastructure/data/repositories/chatbot/chatbot-repository.impl';

export const chatbotProviders: Provider[] = [
    {
        provide: ChatbotRepository,
        useClass: ChatbotRepositoryImpl,
    },
];
