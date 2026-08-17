import { Provider } from '@angular/core';

import { infrastructureTypeFindOneProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/infrastructure-type-find-one.providers';
import { infrastructureTypeSelectProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/infrastructure-type-select.providers';
import { infrastructureTypeProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure-type/infrastructure-type.providers';
import { infrastructureFindOneProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure/infrastructure-find-one.providers';
import { infrastructureSelectProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure/infrastructure-select.providers';
import { infrastructureProviders } from '@presentation/pages/administrative-infrastructure/di/infrastructure/infrastructure.providers';

export const provideAdministrativeInfrastructure = (): Provider[] => [
    ...infrastructureTypeProviders,
    ...infrastructureTypeFindOneProviders,
    ...infrastructureTypeSelectProviders,

    ...infrastructureProviders,
    ...infrastructureFindOneProviders,
    ...infrastructureSelectProviders,
];
