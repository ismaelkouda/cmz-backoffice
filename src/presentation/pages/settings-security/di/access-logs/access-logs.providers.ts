import { Provider } from '@angular/core';
import { AccessLogsRepository } from '@presentation/pages/settings-security/core/domain/repositories/access-logs/access-logs.repository';
import { AccessLogsMapper } from '@presentation/pages/settings-security/infrastructure/data/mappers/access-logs/access-logs.mapper';
import { AccessLogsRepositoryImpl } from '@presentation/pages/settings-security/infrastructure/data/repositories/access-logs/access-logs-repository.impl';
import { AccessLogsApi } from '@presentation/pages/settings-security/infrastructure/data/sources/access-logs/access-logs.api';

export const accessLogsProviders: Provider[] = [
    AccessLogsApi,
    AccessLogsMapper,
    {
        provide: AccessLogsRepository,
        useClass: AccessLogsRepositoryImpl,
    },
];

