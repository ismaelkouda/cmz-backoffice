import { DetailsTakeEntity } from '@pages/report-states/domain/entities/details/details-take.entity';
import { DetailsTakeApiDto } from '@pages/report-states/infrastructure/api/dto/details/details-take-api.dto';

export function detailsTakeMapper(
    entity: DetailsTakeEntity
): DetailsTakeApiDto {
    return { uniq_id: entity.uniqId };
}
