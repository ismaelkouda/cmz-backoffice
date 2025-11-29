import { Provider } from '@angular/core';
import { AgentRepository } from '../domain/repositories/agent.repository';
import { AgentRepositoryImpl } from '../data/repositories/agent.repository.impl';

export const provideAgent = (): Provider[] => [
    {
        provide: AgentRepository,
        useClass: AgentRepositoryImpl,
    },
];
