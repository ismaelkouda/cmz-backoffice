import { detailsPermissionsFinalize } from '@pages/finalization/domain/functions/details/details-permissions-finalize.function';
import { detailsPermissionsTake } from '@pages/finalization/domain/functions/details/details-permissions-take.function';

import {
    DetailsContext,
    DetailsRule,
} from '../../entities/details/details.entity';

const RULES: DetailsRule[] = [
    {
        name: 'TAKE',
        when: (ctx) =>
            detailsPermissionsTake(ctx.props, ctx.permissions.canTake),
        title: 'MANAGEMENT.BUTTONS.TAKE',
    },
    {
        name: 'APPROVE',
        when: (ctx) =>
            detailsPermissionsFinalize(ctx.props, ctx.permissions.canFinalize),
        title: 'MANAGEMENT.BUTTONS.FINALIZATION',
    },
];

export function detailsLabelButtonSubmit(ctx: DetailsContext): string {
    const rule = RULES.find((r) => r.when(ctx));
    return rule?.title ?? 'MANAGEMENT.BUTTONS.INFORMATION';
}
