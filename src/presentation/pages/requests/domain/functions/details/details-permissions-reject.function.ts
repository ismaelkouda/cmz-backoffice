import { DetailsStatus } from '@presentation/pages/requests/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@presentation/pages/requests/domain/interfaces/details/details-props.interface';

export function detailsPermissionsReject(props: DetailsProps): boolean {
    return props.status === DetailsStatus.IN_PROGRESS;
}
