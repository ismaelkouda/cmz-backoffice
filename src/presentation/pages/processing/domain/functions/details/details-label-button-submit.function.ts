import { detailsPermissionsTake } from '@presentation/pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@presentation/pages/processing/domain/functions/details/details-permissions-treat.function';
import { DetailsProps } from '@presentation/pages/processing/domain/interfaces/details/details-props.interface';

export function detailsLabelButtonSubmit(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.BUTTONS.TAKE';
    } else if (detailsPermissionsTreat(props)) {
        return 'MANAGEMENT.BUTTONS.TREATMENT';
    } else {
        return 'MANAGEMENT.BUTTONS.INFORMATION';
    }
}
