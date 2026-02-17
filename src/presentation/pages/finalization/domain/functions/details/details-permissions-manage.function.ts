import { detailsPermissionsFinalize } from '@presentation/pages/finalization/domain/functions/details/details-permissions-finalize.function';
import { detailsPermissionsTake } from '@presentation/pages/finalization/domain/functions/details/details-permissions-take.function';
import { DetailsProps } from '@presentation/pages/finalization/domain/interfaces/details/details-props.interface';
import { DetailsPermissions } from '@presentation/pages/finalization/domain/types/details/details-permissions.type';

export function detailsPermissionsManage(
    props: DetailsProps
): DetailsPermissions {
    if (detailsPermissionsTake(props)) {
        return 'take';
    } else if (detailsPermissionsFinalize(props)) {
        return 'finalize';
    } else {
        return 'see';
    }
}
