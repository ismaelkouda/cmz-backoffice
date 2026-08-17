import { Provider } from '@angular/core';
import { provideMapClusters } from '@shared/components/map-clusters/di/map-clusters.providers';

import { provideMap } from './map.providers';

export const provideInteractiveMap = (): Provider[] => [
    ...provideMapClusters,
    ...provideMap,
];
