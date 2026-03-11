import { DetailsRejectEntity } from '@pages/requests/domain/entities/details/details-reject.entity';
import { DetailsRejectApiDto } from '@pages/requests/infrastructure/api/dto/details/details-reject-api.dto';

export function detailsRejectMapper(
    entity: DetailsRejectEntity
): DetailsRejectApiDto {
    return {
        uniq_id: entity.uniqId,
        comment: entity.comment,
        reason: entity.reason,
    };
}
