import { detailsPermissionsTake } from '@presentation/pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@presentation/pages/processing/domain/functions/details/details-permissions-treat.function';
import { DetailsProps } from '@presentation/pages/processing/domain/interfaces/details/details-props.interface';

export function detailsTitle(props: DetailsProps): string {
    if (detailsPermissionsTake(props)) {
        return 'MANAGEMENT.STATUS.TAKE';
    } else if (detailsPermissionsTreat(props)) {
        return 'MANAGEMENT.STATUS.TREATMENT';
    } else {
        return 'MANAGEMENT.STATUS.INFORMATION';
    }
}
