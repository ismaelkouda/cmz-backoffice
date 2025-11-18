import { Provider } from '@angular/core';
import { TreatmentRepository } from '../domain/repositories/treatment.repository';
import { TreatmentRepositoryImpl } from '../data/repositories/treatment.repository.impl';

export const provideTreatment = (): Provider[] => [
    {
        provide: TreatmentRepository,
        useClass: TreatmentRepositoryImpl,
    },
];
