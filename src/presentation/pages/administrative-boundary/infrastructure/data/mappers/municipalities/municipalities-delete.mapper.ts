import { MunicipalitiesDeleteEntity } from '@presentation/pages/administrative-boundary/domain/entities/municipalities/municipalities-delete.entity';
import { MunicipalitiesDeleteApiDto } from '@presentation/pages/administrative-boundary/infrastructure/api/dto/municipalities/municipalities-delete-api.dto';

export function municipalitiesDeleteMapper(
    vo: MunicipalitiesDeleteEntity
): MunicipalitiesDeleteApiDto {
    const prams = {} as MunicipalitiesDeleteApiDto;
    if (vo.uniqId) {
        prams.uniq_id = vo.uniqId;
    }
    return prams;
}
