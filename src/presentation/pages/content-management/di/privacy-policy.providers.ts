import { Provider } from '@angular/core';
import { PrivacyPolicyRepository } from '../core/domain/repositories/privacy-policy.repository';
import { PrivacyPolicyRepositoryImpl } from '../infrastructure/data/repositories/privacy-policy.repository.impl';

export const providePrivacyPolicy = (): Provider[] => [
    {
        provide: PrivacyPolicyRepository,
        useClass: PrivacyPolicyRepositoryImpl,
    },
];
