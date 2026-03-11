import { DetailsApproveEntity } from '@pages/requests/domain/entities/details/details-approve.entity';
import { DetailsApproveApiDto } from '@pages/requests/infrastructure/api/dto/details/details-approve-api.dto';

export function detailsApproveMapper(
    entity: DetailsApproveEntity
): DetailsApproveApiDto {
    return { uniq_id: entity.uniqId, comment: entity.comment };
}
