import { Provider } from '@angular/core';

import { LegalNoticeFindOneRepository } from '@presentation/pages/content-management/domain/repositories/legal-notice/legal-notice-find-one-repository';
import { LegalNoticeFindOneRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/legal-notice/legal-notice-find-one-repository.impl';

export const legalNoticeFindOneProviders: Provider[] = [
    {
        provide: LegalNoticeFindOneRepository,
        useClass: LegalNoticeFindOneRepositoryImpl,
    },
];
