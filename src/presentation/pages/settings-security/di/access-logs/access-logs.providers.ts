import { Provider } from '@angular/core';
import { AccessLogsRepository } from '@pages/settings-security/domain/repositories/access-logs/access-logs.repository';
import { AccessLogsRepositoryImpl } from '@pages/settings-security/infrastructure/data/repositories/access-logs/access-logs-repository.impl';

export const accessLogsProviders: Provider[] = [
    {
        provide: AccessLogsRepository,
        useClass: AccessLogsRepositoryImpl,
    },
];
