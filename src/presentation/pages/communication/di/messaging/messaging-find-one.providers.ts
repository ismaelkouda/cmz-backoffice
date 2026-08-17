import { Provider } from '@angular/core';
import { MessagingFindOneRepository } from '@pages/communication/domain/repositories/messaging/messaging-find-one-repository';
import { MessagingFindOneRepositoryImpl } from '@pages/communication/infrastructure/data/repositories/messaging/messaging-find-one-repository.impl';

export const messagingFindOneProviders: Provider[] = [
    {
        provide: MessagingFindOneRepository,
        useClass: MessagingFindOneRepositoryImpl,
    },
];
