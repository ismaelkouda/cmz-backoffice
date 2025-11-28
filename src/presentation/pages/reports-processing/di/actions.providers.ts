import { Provider } from '@angular/core';
import { ActionsRepositoryImpl } from '../data/repositories/actions.repository.impl';
import { ActionsRepository } from '../domain/repositories/actions.repository';

export const provideActions = (): Provider[] => [
    {
        provide: ActionsRepository,
        useClass: ActionsRepositoryImpl,
    },
];
