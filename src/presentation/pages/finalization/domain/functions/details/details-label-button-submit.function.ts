import { detailsPermissionsFinalize } from '@presentation/pages/finalization/domain/functions/details/details-permissions-finalize.function';
import { detailsPermissionsTake } from '@presentation/pages/finalization/domain/functions/details/details-permissions-take.function';
import { DetailsProps } from '@presentation/pages/finalization/domain/interfaces/details/details-props.interface';

export function detailsLabelButtonSubmit(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.BUTTONS.TAKE';
    } else if (detailsPermissionsFinalize(props)) {
        return 'MANAGEMENT.BUTTONS.FINALIZATION';
    } else {
        return 'MANAGEMENT.BUTTONS.INFORMATION';
    }
}
