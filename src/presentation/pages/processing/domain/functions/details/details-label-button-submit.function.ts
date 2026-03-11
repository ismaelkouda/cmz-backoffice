import { detailsPermissionsTake } from '@pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@pages/processing/domain/functions/details/details-permissions-treat.function';
import { DetailsProps } from '@pages/processing/domain/interfaces/details/details-props.interface';

export function detailsLabelButtonSubmit(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.BUTTONS.TAKE';
    } else if (detailsPermissionsTreat(props)) {
        return 'MANAGEMENT.BUTTONS.TREATMENT';
    } else {
        return 'MANAGEMENT.BUTTONS.INFORMATION';
    }
}
