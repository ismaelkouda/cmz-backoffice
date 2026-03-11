import { detailsPermissionsTake } from '@pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@pages/processing/domain/functions/details/details-permissions-treat.function';
import { DetailsProps } from '@pages/processing/domain/interfaces/details/details-props.interface';

export function detailsTitle(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.STATUS.TAKE';
    } else if (detailsPermissionsTreat(props)) {
        return 'MANAGEMENT.STATUS.TREATMENT';
    } else {
        return 'MANAGEMENT.STATUS.INFORMATION';
    }
}
