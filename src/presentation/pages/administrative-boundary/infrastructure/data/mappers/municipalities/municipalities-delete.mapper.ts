import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';
import { MunicipalitiesDeleteApiDto } from '@pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-delete-api.dto';

export function municipalitiesDeleteMapper(
    dto: MunicipalitiesDeleteDto
): MunicipalitiesDeleteApiDto {
    const prams = {} as MunicipalitiesDeleteApiDto;
    if (dto.uniqId) {
        prams.uniq_id = dto.uniqId;
    }
    return prams;
}
