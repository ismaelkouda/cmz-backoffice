import { Provider } from '@angular/core';
import { TwoFactorEnableRepository } from '../domain/repositories/two-factor-enable.repository';
import { TwoFactorEnableRepositoryImpl } from '../infrastructure/data/repositories/two-factor-enable.repository.impl';

export const provideTwoFactorEnable: Provider[] = [
    {
        provide: TwoFactorEnableRepository,
        useClass: TwoFactorEnableRepositoryImpl,
    },
];
