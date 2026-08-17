import { Provider } from '@angular/core';
import { chatbotFindOneProviders } from '@shared/components/management/di/chatbot/chatbot-find-one.providers';
import { chatbotProviders } from '@shared/components/management/di/chatbot/chatbot.providers';

export const provideManagement = (): Provider[] => [
    ...chatbotProviders,
    ...chatbotFindOneProviders,
];
