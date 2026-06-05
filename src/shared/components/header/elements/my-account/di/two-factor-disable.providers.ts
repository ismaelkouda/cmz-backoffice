import { Provider } from '@angular/core';
import { TwoFactorDisableRepository } from '../domain/repositories/two-factor-disable.repository';
import { TwoFactorDisableRepositoryImpl } from '../infrastructure/data/repositories/two-factor-disable.repository.impl';

export const provideTwoFactorDisable: Provider[] = [
    {
        provide: TwoFactorDisableRepository,
        useClass: TwoFactorDisableRepositoryImpl,
    },
];
