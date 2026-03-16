import { DetailsQualificationState } from '@pages/requests/domain/enums/details/details-qualification-state/details-qualification-state.enum';
import { Status } from '@pages/requests/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@pages/requests/domain/interfaces/details/details-props.interface';

export function detailsPermissionsApprove(props: DetailsProps): boolean {
    return (
        props.status === Status.IN_PROGRESS &&
        props.qualificationState === DetailsQualificationState.PENDING
    );
}
