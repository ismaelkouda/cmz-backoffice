import { Provider } from '@angular/core';
import { TermsUseRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-repository';
import { TermsUseRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/terms-use/terms-use-repository.impl';

export const termsUseProviders: Provider[] = [
    {
        provide: TermsUseRepository,
        useClass: TermsUseRepositoryImpl,
    },
];
