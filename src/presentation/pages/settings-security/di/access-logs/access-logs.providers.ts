import { Provider } from '@angular/core';

import { AccessLogsRepository } from '@presentation/pages/settings-security/domain/repositories/access-logs/access-logs.repository';
import { AccessLogsRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/access-logs/access-logs-repository.impl';

export const accessLogsProviders: Provider[] = [
    {
        provide: AccessLogsRepository,
        useClass: AccessLogsRepositoryImpl,
    },
];
