import { Provider } from '@angular/core';
import { AdmissibleRepository } from '@pages/report-states/domain/repositories/admissible/admissible.repository';
import { AdmissibleRepositoryImpl } from '@pages/report-states/infrastructure/data/repositories/admissible/admissible.repository.impl';

export const provideAdmissible: Provider[] = [
    {
        provide: AdmissibleRepository,
        useClass: AdmissibleRepositoryImpl,
    },
];
