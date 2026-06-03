import { Provider } from '@angular/core';
import { MapRepositoryImpl } from '../infrastructure/repositories/map.repository.impl';
import { MapRepository } from '../domain/repositories/map-repository.interface';

export const provideMap: Provider[] = [
    { provide: MapRepository, useClass: MapRepositoryImpl },
];
