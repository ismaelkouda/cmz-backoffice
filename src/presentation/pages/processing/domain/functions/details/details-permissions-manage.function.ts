import { detailsPermissionsTake } from '@pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@pages/processing/domain/functions/details/details-permissions-treat.function';
import { DetailsProps } from '@pages/processing/domain/interfaces/details/details-props.interface';
import { DetailsPermissions } from '@pages/processing/domain/types/details/details-permissions.type';

export function detailsPermissionsManage(
    props: DetailsProps
): DetailsPermissions {
    if (detailsPermissionsTake(props)) {
        return 'take';
    } else if (detailsPermissionsTreat(props)) {
        return 'treat';
    } else {
        return 'see';
    }
}
