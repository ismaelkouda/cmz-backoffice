import { detailsPermissionsFinalize } from '@pages/finalization/domain/functions/details/details-permissions-finalize.function';
import { detailsPermissionsTake } from '@pages/finalization/domain/functions/details/details-permissions-take.function';
import { DetailsProps } from '@pages/finalization/domain/interfaces/details/details-props.interface';

export function detailsTitle(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.STATUS.TAKE';
    } else if (detailsPermissionsFinalize(props)) {
        return 'MANAGEMENT.STATUS.FINALIZATION';
    } else {
        return 'MANAGEMENT.STATUS.INFORMATION';
    }
}
