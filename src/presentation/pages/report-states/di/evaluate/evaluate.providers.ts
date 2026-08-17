import { Provider } from '@angular/core';
import { EvaluateRepository } from '@pages/report-states/domain/repositories/evaluate/evaluate.repository';
import { EvaluateRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/evaluate/evaluate.repository.impl';

export const provideEvaluate: Provider[] = [
    {
        provide: EvaluateRepository,
        useClass: EvaluateRepositoryImpl,
    },
];
