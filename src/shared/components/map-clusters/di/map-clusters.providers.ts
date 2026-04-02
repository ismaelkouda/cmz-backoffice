import { Provider } from '@angular/core';
import { MapClustersRepository } from '@shared/components/map-clusters/domain/repositories/map-clusters.repository';
import { MapClustersRepositoryImpl } from '@shared/components/map-clusters/infrastructure/data/repositories/map-clusters.repository.impl';

export const provideMapClusters: Provider[] = [
    {
        provide: MapClustersRepository,
        useClass: MapClustersRepositoryImpl,
    },
];
