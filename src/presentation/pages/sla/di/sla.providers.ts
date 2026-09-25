import { Provider } from '@angular/core';
import { SlaRepository } from '@pages/sla/domain/repositories/sla/sla.repository';
import { SlaRepositoryImpl } from '@pages/sla/infrastructure/data/repositories/sla/sla.repository.impl';

export const provideSla = (): Provider[] => [
    { provide: SlaRepository, useClass: SlaRepositoryImpl },
];
