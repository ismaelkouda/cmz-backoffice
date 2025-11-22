import { Provider } from '@angular/core';
import { DetailsMapper } from '../data/mappers/details.mapper';
import { DetailsRepositoryImpl } from '../data/repositories/details.repository.impl';
import { DetailsApi } from '../data/sources/details.api';
import { DetailsRepository } from '../domain/repositories/details.repository';

export function provideDetails(): Provider[] {
    return [
        DetailsApi,
        DetailsMapper,
        DetailsRepositoryImpl,
        {
            provide: DetailsRepository,
            useExisting: DetailsRepositoryImpl,
        },
    ];
}
