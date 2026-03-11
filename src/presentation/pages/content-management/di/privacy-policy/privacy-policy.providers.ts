import { Provider } from '@angular/core';
import { PrivacyPolicyRepository } from '@pages/content-management/domain/repositories/privacy-policy/privacy-policy-repository';
import { PrivacyPolicyRepositoryImpl } from '@pages/content-management/infrastructure/data/repositories/privacy-policy/privacy-policy-repository.impl';

export const privacyPolicyProviders: Provider[] = [
    {
        provide: PrivacyPolicyRepository,
        useClass: PrivacyPolicyRepositoryImpl,
    },
];
