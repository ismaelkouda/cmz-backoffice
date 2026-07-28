import { Provider } from '@angular/core';
import { RadioRelayLinksFindOneRepository } from '@pages/coverage-areas/domain/repositories/radio-relay-links/radio-relay-links-find-one.repository';
import { RadioRelayLinksFindOneRepositoryImpl } from '@pages/coverage-areas/infrastructure/data/repositories/radio-relay-links/radio-relay-links-find-one.repository.impl';

export const radioRelayLinksFindOneProviders: Provider[] = [
    {
        provide: RadioRelayLinksFindOneRepository,
        useClass: RadioRelayLinksFindOneRepositoryImpl,
    },
];
