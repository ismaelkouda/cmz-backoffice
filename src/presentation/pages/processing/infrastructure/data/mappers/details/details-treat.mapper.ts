import { DetailsTreatEntity } from '@presentation/pages/processing/domain/entities/details/details-treat.entity';
import { DetailsTreatApiDto } from '@presentation/pages/processing/infrastructure/api/dto/details/details-treat-api.dto';

export function detailsTreatMapper(
    entity: DetailsTreatEntity
): DetailsTreatApiDto {
    return { uniq_id: entity.uniqId, comment: entity.comment };
}
