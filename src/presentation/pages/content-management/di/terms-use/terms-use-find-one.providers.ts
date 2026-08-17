import { Provider } from '@angular/core';
import { TermsUseFindOneRepository } from '@pages/content-management/domain/repositories/terms-use/terms-use-find-one-repository';
import { TermsUseFindOneRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/terms-use/terms-use-find-one-repository.impl';

export const termsUseFindOneProviders: Provider[] = [
    {
        provide: TermsUseFindOneRepository,
        useClass: TermsUseFindOneRepositoryImpl,
    },
];
