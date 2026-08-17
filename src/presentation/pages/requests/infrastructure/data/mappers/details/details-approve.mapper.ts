import { DetailsApproveEntity } from '@pages/requests/domain/entities/details/details-approve.entity';
import { DetailsApproveApiDto } from '@pages/requests/infrastructure/api/dto/details/details-approve-api.dto';

export function detailsApproveMapper(
    entity: DetailsApproveEntity
): DetailsApproveApiDto {
    const placePhoto =
        entity.placePhoto?.type === 'remote'
            ? entity.placePhoto.url
            : entity.placePhoto?.type === 'local'
              ? entity.placePhoto.file
              : null;

    return {
        uniq_id: entity.uniqId,
        comment: entity.comment,
        approval_type: entity.approvalType,
        callback_type: entity.callbackType,
        lat: String(entity.coordinates.latitude),
        long: String(entity.coordinates.longitude),
        location_name: entity.locationName,
        report_type: entity.reportType,
        operators: entity.operators,
        description: entity.description,
        decision: entity.decision,
        place_description: entity.placeDescription,
        reason: entity.reason,
        place_photo: placePhoto,
    };
}
