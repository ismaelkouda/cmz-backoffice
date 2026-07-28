import { Provider } from '@angular/core';
import { RadioRelayLinksRepository } from '@pages/coverage-areas/domain/repositories/radio-relay-links/radio-relay-links.repository';
import { RadioRelayLinksRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/radio-relay-links/radio-relay-links.repository.impl';

export const radioRelayLinksProviders: Provider[] = [
    {
        provide: RadioRelayLinksRepository,
        useClass: RadioRelayLinksRepositoryImpl,
    },
];
