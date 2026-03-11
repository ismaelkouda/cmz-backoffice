import { Provider } from '@angular/core';
import { MessagingRepository } from '@pages/communication/domain/repositories/messaging/messaging-repository';
import { MessagingRepositoryImpl } from '@pages/communication/infrastructure/data/repositories/messaging/messaging-repository.impl';

export const messagingProviders: Provider[] = [
    {
        provide: MessagingRepository,
        useClass: MessagingRepositoryImpl,
    },
];
