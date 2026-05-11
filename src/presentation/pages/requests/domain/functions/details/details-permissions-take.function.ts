import { Status } from '@pages/requests/domain/enums/details/details-status/details-status.enum';
import { DetailsProps } from '@pages/requests/domain/interfaces/details/details-props.interface';

export function detailsPermissionsTake(
    props: DetailsProps,
    permission: boolean
): boolean {
    return permission && props.status === Status.PENDING;
}
