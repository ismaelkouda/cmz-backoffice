import { DetailsApproveDto } from '@pages/report-states/application/dto/details/details-approve.dto';
import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { MediaValue } from '@shared/domain/types/media.types';

export class DetailsApproveVo {
    public readonly uniqId: string;
    public readonly comment: string;
    public readonly approvalType: string;
    public readonly callbackType: string | null;
    public readonly coordinates: Coordinates;
    public readonly locationName: string;
    public readonly reportType: string;
    public readonly operators: string[];
    public readonly description: string;
    public readonly decision: string;
    public readonly placeDescription: string;
    public readonly reason: string | null;
    public readonly placePhoto: MediaValue;

    constructor(props: {
        uniqId: string;
        comment: string;
        approvalType: string;
        callbackType: string | null;
        coordinates: Coordinates;
        locationName: string;
        reportType: string;
        operators: string[];
        description: string;
        decision: string;
        placeDescription: string;
        reason: string | null;
        placePhoto: MediaValue;
    }) {
        this.uniqId = props.uniqId;
        this.comment = props.comment;
        this.approvalType = props.approvalType;
        this.callbackType = props.callbackType;
        this.coordinates = props.coordinates;
        this.locationName = props.locationName;
        this.reportType = props.reportType;
        this.operators = props.operators;
        this.description = props.description;
        this.decision = props.decision;
        this.placeDescription = props.placeDescription;
        this.reason = props.reason;
        this.placePhoto = props.placePhoto;
    }

    static fromDto(dto: DetailsApproveDto): DetailsApproveVo {
        return new DetailsApproveVo({
            uniqId: dto.uniqId,
            comment: dto.comment,
            approvalType: dto.approvalType,
            callbackType: dto.callbackType,
            coordinates: dto.coordinates,
            locationName: dto.locationName,
            reportType: dto.reportType,
            operators: dto.operators,
            description: dto.description,
            decision: dto.decision,
            placeDescription: dto.placeDescription,
            reason: dto.reason,
            placePhoto: dto.placePhoto,
        });
    }
}
