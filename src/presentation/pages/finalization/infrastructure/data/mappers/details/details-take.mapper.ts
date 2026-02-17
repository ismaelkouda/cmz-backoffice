import { DetailsTakeEntity } from '@presentation/pages/finalization/domain/entities/details/details-take.entity';
import { DetailsTakeApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/details/details-take-api.dto';

export function detailsTakeMapper(
    entity: DetailsTakeEntity
): DetailsTakeApiDto {
    return { uniq_id: entity.uniqId };
}
