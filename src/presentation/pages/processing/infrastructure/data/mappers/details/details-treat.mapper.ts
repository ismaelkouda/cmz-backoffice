import { DetailsTreatEntity } from '@pages/processing/domain/entities/details/details-treat.entity';
import { DetailsTreatApiDto } from '@pages/processing/infrastructure/api/dto/details/details-treat-api.dto';

export function detailsTreatMapper(
    entity: DetailsTreatEntity
): DetailsTreatApiDto {
    return { uniq_id: entity.uniqId, comment: entity.comment };
}
