import { RegionsSelectRepository } from "@presentation/pages/administrative-boundary/core/domain/repositories/regions/regions-select-repository";
import { RegionsSelectMapper } from "@presentation/pages/administrative-boundary/infrastructure/data/mappers/regions/regions-select.mapper";
import { RegionsSelectRepositoryImpl } from "@presentation/pages/administrative-boundary/infrastructure/data/repositories/regions/regions-select.repository.impl";
import { RegionsSelectApi } from "@presentation/pages/administrative-boundary/infrastructure/data/sources/regions/regions-select.api";


export const regionsSelectProviders = [
    RegionsSelectApi,
    RegionsSelectMapper,
    { provide: RegionsSelectRepository, useClass: RegionsSelectRepositoryImpl },
];