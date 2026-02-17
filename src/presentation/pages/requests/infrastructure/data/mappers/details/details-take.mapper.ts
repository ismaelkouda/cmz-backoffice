import { DetailsTakeEntity } from '@presentation/pages/requests/domain/entities/details/details-take.entity';
import { DetailsTakeApiDto } from '@presentation/pages/requests/infrastructure/api/dto/details/details-take-api.dto';

export function detailsTakeMapper(
    entity: DetailsTakeEntity
): DetailsTakeApiDto {
    return { uniq_id: entity.uniqId };
}
