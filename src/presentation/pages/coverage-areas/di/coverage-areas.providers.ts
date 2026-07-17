import { Provider } from '@angular/core';

import { siteGroupFindOneProviders } from '@pages/coverage-areas/di/site-group/site-group-find-one.providers';
import { siteGroupSelectProviders } from '@pages/coverage-areas/di/site-group/site-group-select.providers';
import { siteGroupProviders } from '@pages/coverage-areas/di/site-group/site-group.providers';

import { mobileNetworkFindOneProviders } from '@pages/coverage-areas/di/mobile-network/mobile-network-find-one.providers';
import { mobileNetworkProviders } from '@pages/coverage-areas/di/mobile-network/mobile-network.providers';
import { towerTypeSelectProviders } from '@pages/coverage-areas/di/tower-type/tower-type-select.providers';

export const provideCoverageAreas = (): Provider[] => [
    ...siteGroupProviders,
    ...siteGroupFindOneProviders,
    ...siteGroupSelectProviders,

    ...mobileNetworkProviders,
    ...mobileNetworkFindOneProviders,

    ...towerTypeSelectProviders,
];
