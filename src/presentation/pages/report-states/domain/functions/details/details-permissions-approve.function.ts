import { DetailsQualificationState } from '@pages/report-states/domain/enums/details/details-qualification-state/details-qualification-state.enum';
import { Status } from '@pages/report-states/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@pages/report-states/domain/interfaces/details/details-props.interface';

export function detailsPermissionsApprove(
    props: DetailsProps,
    permission: boolean
): boolean {
    return (
        permission &&
        props.status === Status.IN_PROGRESS &&
        props.qualificationState === DetailsQualificationState.PENDING
    );
}
