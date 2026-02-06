import { Provider } from '@angular/core';

import { TreatmentRepositoryImpl } from '../data/repositories/treatment.repository.impl';
import { TreatmentRepository } from '../domain/repositories/treatment.repository';

export const provideTreatment = (): Provider[] => [
    {
        provide: TreatmentRepository,
        useClass: TreatmentRepositoryImpl,
    },
];
