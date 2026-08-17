import { Status } from '@pages/report-states/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@pages/report-states/domain/interfaces/details/details-props.interface';

export function detailsPermissionsReject(props: DetailsProps): boolean {
    return props.status === Status.IN_PROGRESS;
}
