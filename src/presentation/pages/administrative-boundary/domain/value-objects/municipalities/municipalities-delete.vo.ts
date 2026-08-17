import { MunicipalitiesDeleteDto } from '@pages/administrative-boundary/application/dto/municipalities/municipalities-delete.dto';

export function municipalitiesDeleteVo(
    dto: MunicipalitiesDeleteDto
): MunicipalitiesDeleteDto {
    return {
        uniqId: dto.uniqId,
    };
}
