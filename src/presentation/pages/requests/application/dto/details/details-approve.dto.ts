import { Coordinates } from '@shared/domain/interfaces/coordinates.interface';
import { MediaValue } from '@shared/domain/types/media.types';

export interface DetailsApproveDto {
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
}
