import { RegionsFindoneRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-findone-repository";
import { RegionsFindoneMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-findone.mapper";
import { RegionsFindoneRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/regions-findone.repository.impl";
import { RegionsFindoneApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions-findone.api";

export const provideRegionsFindone = [
    RegionsFindoneApi,
    RegionsFindoneMapper,
    { provide: RegionsFindoneRepository, useClass: RegionsFindoneRepositoryImpl },
];