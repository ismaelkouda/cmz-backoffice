import { Provider } from '@angular/core';
import { TermsUseRepository } from '../core/domain/repositories/terms-use.repository';
import { TermsUseRepositoryImpl } from '../infrastructure/data/repositories/terms-use.repository.impl';

export const provideTermsUse = (): Provider[] => [
    {
        provide: TermsUseRepository,
        useClass: TermsUseRepositoryImpl,
    },
];
