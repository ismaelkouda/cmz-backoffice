import { Status } from '@presentation/pages/requests/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@presentation/pages/requests/domain/interfaces/details/details-props.interface';

export function detailsPermissionsTake(props: DetailsProps): boolean {
    return props.status === Status.PENDING;
}
