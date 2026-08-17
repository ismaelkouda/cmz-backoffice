import { Provider } from '@angular/core';
import { DetailsRepository } from '@pages/finalization/domain/repositories/details/details-repository';
import { DetailsRepositoryImpl } from '@pages/finalization/infrastructure/data/repositories/details/details-repository.impl';

export const provideDetails: Provider[] = [
    {
        provide: DetailsRepository,
        useClass: DetailsRepositoryImpl,
    },
];
