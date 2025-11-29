import { Provider } from '@angular/core';
import { TeamRepository } from '../domain/repositories/team.repository';
import { TeamRepositoryImpl } from '../data/repositories/team.repository.impl';

export const provideTeam = (): Provider[] => [
    {
        provide: TeamRepository,
        useClass: TeamRepositoryImpl,
    },
];
