import { Provider } from '@angular/core';

import { LegalNoticeRepository } from '@presentation/pages/content-management/domain/repositories/legal-notice/legal-notice-repository';
import { LegalNoticeRepositoryImpl } from '@presentation/pages/content-management/infrastructure/data/repositories/legal-notice/legal-notice-repository.impl';

export const legalNoticeProviders: Provider[] = [
    {
        provide: LegalNoticeRepository,
        useClass: LegalNoticeRepositoryImpl,
    },
];
