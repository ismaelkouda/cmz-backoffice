import { ProcessingState } from '@pages/processing/domain/enums/details/details-processing-state/details-processing-state.enum';
import { DetailsProps } from '@pages/processing/domain/interfaces/details/details-props.interface';

export function detailsPermissionsTake(props: DetailsProps): boolean {
    return props.processingState === ProcessingState.PENDING;
}
