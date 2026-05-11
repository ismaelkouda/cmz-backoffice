import { FinalizationState } from '@pages/finalization/domain/enums/details/details-finalization-state/details-finalization-state.enum';
import { DetailsProps } from '@pages/finalization/domain/interfaces/details/details-props.interface';

export function detailsPermissionsTake(
    props: DetailsProps,
    permission: boolean
): boolean {
    return permission && props.finalizationState === FinalizationState.PENDING;
}
