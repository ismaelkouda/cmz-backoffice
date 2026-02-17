import { DetailsTakeEntity } from '@presentation/pages/processing/domain/entities/details/details-take.entity';
import { DetailsTakeApiDto } from '@presentation/pages/processing/infrastructure/api/dto/details/details-take-api.dto';

export function detailsTakeMapper(
    entity: DetailsTakeEntity
): DetailsTakeApiDto {
    return { uniq_id: entity.uniqId };
}
