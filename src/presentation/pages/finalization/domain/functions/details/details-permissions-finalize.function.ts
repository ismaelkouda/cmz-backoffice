import { DetailsFinalizationState } from '@presentation/pages/finalization/domain/enums/details/details-finalization-state/details-finalization-state.enum';
import { DetailsProps } from '@presentation/pages/finalization/domain/interfaces/details/details-props.interface';

export function detailsPermissionsFinalize(props: DetailsProps): boolean {
    return props.finalizationState === DetailsFinalizationState.IN_PROGRESS;
}
