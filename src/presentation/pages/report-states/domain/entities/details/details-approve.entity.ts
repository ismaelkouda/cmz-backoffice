import { DetailsApproveVo } from '@pages/report-states/domain/value-objects/details/details-approve.vo';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { MediaValue } from '@shared/domain/types/media.types';

export class DetailsApproveEntity {
    constructor(
        public readonly uniqId: string,
        public readonly comment: string,
        public readonly approvalType: string,
        public readonly callbackType: string | null,
        public readonly coordinates: Coordinates,
        public readonly locationName: string,
        public readonly reportType: string,
        public readonly operators: string[],
        public readonly description: string,
        public readonly decision: string,
        public readonly placeDescription: string,
        public readonly reason: string | null,
        public readonly placePhoto: MediaValue
    ) {}

    static fromVo(vo: DetailsApproveVo): DetailsApproveEntity {
        return new DetailsApproveEntity(
            vo.uniqId,
            vo.comment,
            vo.approvalType,
            vo.callbackType,
            vo.coordinates,
            vo.locationName,
            vo.reportType,
            vo.operators,
            vo.description,
            vo.decision,
            vo.placeDescription,
            vo.reason,
            vo.placePhoto
        );
    }
}
