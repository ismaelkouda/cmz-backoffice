import { detailsPermissionsApprove } from '@presentation/pages/requests/domain/functions/details/details-permissions-approve.function';
import { detailsPermissionsReject } from '@presentation/pages/requests/domain/functions/details/details-permissions-reject.function';
import { detailsPermissionsTake } from '@presentation/pages/requests/domain/functions/details/details-permissions-take.function';
import { DetailsProps } from '@presentation/pages/requests/domain/interfaces/details/details-props.interface';

export function detailsTitle(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.STATUS.TAKE';
    } else if (
        detailsPermissionsApprove(props) ||
        detailsPermissionsReject(props)
    ) {
        return 'MANAGEMENT.STATUS.APPROBATION';
    } else {
        return 'MANAGEMENT.STATUS.INFORMATION';
    }
}
