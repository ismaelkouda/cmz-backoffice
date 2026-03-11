import { detailsPermissionsApprove } from '@pages/requests/domain/functions/details/details-permissions-approve.function';
import { detailsPermissionsReject } from '@pages/requests/domain/functions/details/details-permissions-reject.function';
import { detailsPermissionsTake } from '@pages/requests/domain/functions/details/details-permissions-take.function';
import { DetailsProps } from '@pages/requests/domain/interfaces/details/details-props.interface';
import { DetailsPermissions } from '@pages/requests/domain/types/details/details-permissions.type';

export function detailsPermissionsManage(
    props: DetailsProps
): DetailsPermissions {
    if (detailsPermissionsTake(props)) {
        return 'take';
    } else if (detailsPermissionsApprove(props)) {
        return 'approve';
    } else if (detailsPermissionsReject(props)) {
        return 'approve';
    } else {
        return 'see';
    }
}
