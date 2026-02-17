import { detailsPermissionsApprove } from '@presentation/pages/requests/domain/functions/details/details-permissions-approve.function';
import { detailsPermissionsReject } from '@presentation/pages/requests/domain/functions/details/details-permissions-reject.function';
import { detailsPermissionsTake } from '@presentation/pages/requests/domain/functions/details/details-permissions-take.function';
import { DetailsProps } from '@presentation/pages/requests/domain/interfaces/details/details-props.interface';

export function detailsLabelButtonSubmit(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.BUTTONS.TAKE';
    } else if (detailsPermissionsApprove(props)) {
        return 'MANAGEMENT.BUTTONS.APPROBATION';
    } else if (detailsPermissionsReject(props)) {
        return 'MANAGEMENT.BUTTONS.APPROBATION';
    } else {
        return 'MANAGEMENT.BUTTONS.INFORMATION';
    }
}
