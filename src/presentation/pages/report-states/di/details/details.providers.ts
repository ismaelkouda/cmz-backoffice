import { Provider } from '@angular/core';
import { DetailsRepository } from '@pages/report-states/domain/repositories/details/details-repository';
import { DetailsRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/details/details-repository.impl';

export const provideDetails: Provider[] = [
    {
        provide: DetailsRepository,
        useClass: DetailsRepositoryImpl,
    },
];
