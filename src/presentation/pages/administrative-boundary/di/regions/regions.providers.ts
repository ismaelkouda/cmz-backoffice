import { RegionsRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-repository";
import { RegionsMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions.mapper";
import { RegionsRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/regions.repository.impl";
import { RegionsApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions.api";

export const provideRegions = [
    RegionsApi,
    RegionsMapper,
    { provide: RegionsRepository, useClass: RegionsRepositoryImpl },
];