import { Provider } from '@angular/core';

import { LegalNoticeRepository } from '../domain/repositories/legal-notice.repository';
import { LegalNoticeRepositoryImpl } from '../infrastructure/data/repositories/legal-notice.repository.impl';

export const provideLegalNotice = (): Provider[] => [
    {
        provide: LegalNoticeRepository,
        useClass: LegalNoticeRepositoryImpl,
    },
];
