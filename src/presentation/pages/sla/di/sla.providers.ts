import { Provider } from '@angular/core';
import { SlaRepository } from '@pages/sla/domain/repositories/sla/sla.repository';
import { SlaRepositoryImpl } from '@pages/sla/infrastructure/data/repositories/sla/sla.repository.impl';
import { SlaAlertChannelRepository } from '@pages/sla/domain/repositories/sla/sla-alert-channel.repository';
import { SlaAlertChannelRepositoryImpl } from '@pages/sla/infrastructure/data/repositories/sla/sla-alert-channel.repository.impl';
import { SlaAlertChannelMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-alert-channel.mapper';
import { SlaThresholdRepository } from '@pages/sla/domain/repositories/sla/sla-threshold.repository';
import { SlaThresholdRepositoryImpl } from '@pages/sla/infrastructure/data/repositories/sla/sla-threshold.repository.impl';
import { SlaThresholdMapper } from '@pages/sla/infrastructure/data/mappers/sla/sla-threshold.mapper';

export const provideSla = (): Provider[] => [
    { provide: SlaRepository, useClass: SlaRepositoryImpl },
    {
        provide: SlaAlertChannelRepository,
        useClass: SlaAlertChannelRepositoryImpl,
    },
    { provide: SlaThresholdRepository, useClass: SlaThresholdRepositoryImpl },
    SlaAlertChannelMapper,
    SlaThresholdMapper,
];
