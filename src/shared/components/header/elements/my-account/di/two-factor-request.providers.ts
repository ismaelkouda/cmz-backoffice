import { Provider } from '@angular/core';
import { TwoFactorRequestRepository } from '../domain/repositories/two-factor-request.repository';
import { TwoFactorRequestRepositoryImpl } from '../infrastructure/data/repositories/two-factor-request.repository.impl';

export const provideTwoFactorRequest: Provider[] = [
    {
        provide: TwoFactorRequestRepository,
        useClass: TwoFactorRequestRepositoryImpl,
    },
];
