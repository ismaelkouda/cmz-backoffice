import { Provider } from '@angular/core';
import { FinalizeRepository } from '../domain/repositories/finalize.repository';
import { FinalizeRepositoryImpl } from '../data/repositories/finalize.repository.impl';

export const provideFinalize = (): Provider[] => [
    {
        provide: FinalizeRepository,
        useClass: FinalizeRepositoryImpl,
    },
];

