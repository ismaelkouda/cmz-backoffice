import { DetailsFinalizeEntity } from '@presentation/pages/finalization/domain/entities/details/details-finalize.entity';
import { DetailsFinalizeApiDto } from '@presentation/pages/finalization/infrastructure/api/dto/details/details-finalize-api.dto';

export function detailsFinalizeMapper(
    entity: DetailsFinalizeEntity
): DetailsFinalizeApiDto {
    return { uniq_id: entity.uniqId, comment: entity.comment };
}
