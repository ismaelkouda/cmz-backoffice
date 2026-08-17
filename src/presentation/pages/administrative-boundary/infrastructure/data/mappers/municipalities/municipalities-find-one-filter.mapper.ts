import { MunicipalitiesFindOneFilterEntity } from '@pages/administrative-boundary/domain/entities/municipalities/municipalities-find-one-filter.entity';
import { MunicipalitiesFindOneFilterApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-find-one-filter-api.dto';

export function municipalitiesFindOneFilterMapper(
    entity: MunicipalitiesFindOneFilterEntity
): MunicipalitiesFindOneFilterApiDto {
    const params: MunicipalitiesFindOneFilterApiDto =
        {} as MunicipalitiesFindOneFilterApiDto;

    if (entity.uniqId) {
        params.code = entity.uniqId;
    }

    return params;
}
