import { Provider } from '@angular/core';

import { MessagingFindOneRepository } from '@presentation/pages/communication/domain/repositories/messaging/messaging-find-one-repository';
import { MessagingFindOneRepositoryImpl } from '@presentation/pages/communication/infrastructure/data/repositories/messaging/messaging-find-one-repository.impl';

export const messagingFindOneProviders: Provider[] = [
    {
        provide: MessagingFindOneRepository,
        useClass: MessagingFindOneRepositoryImpl,
    },
];
