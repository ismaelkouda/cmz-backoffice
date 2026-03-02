import { Provider } from '@angular/core';

import { PrivacyPolicyFindOneRepository } from '@presentation/pages/content-management/domain/repositories/privacy-policy/privacy-policy-find-one-repository';
import { PrivacyPolicyFindOneRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/privacy-policy/privacy-policy-find-one-repository.impl';

export const privacyPolicyFindOneProviders: Provider[] = [
    {
        provide: PrivacyPolicyFindOneRepository,
        useClass: PrivacyPolicyFindOneRepositoryImpl,
    },
];
