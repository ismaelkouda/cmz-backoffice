import { ProcessingState } from '@presentation/pages/processing/domain/enums/details/details-processing-state/details-processing-state.enum';
import { DetailsProps } from '@presentation/pages/processing/domain/interfaces/details/details-props.interface';

export function detailsPermissionsTreat(props: DetailsProps): boolean {
    return props.processingState === ProcessingState.IN_PROGRESS;
}
