import { Provider } from '@angular/core';
import { NewspapersRepositoryImpl } from '../data/repositories/newspapers.repository.impl';
import { NewspapersRepository } from '../domain/repositories/newspapers.repository';

export const provideNewspapers = (): Provider[] => [
    {
        provide: NewspapersRepository,
        useClass: NewspapersRepositoryImpl,
    },
];
