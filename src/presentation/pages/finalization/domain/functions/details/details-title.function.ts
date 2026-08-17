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
        title: 'MANAGEMENT.STATUS.TAKE',
    },
    {
        name: 'APPROVE',
        when: (ctx) =>
            detailsPermissionsFinalize(ctx.props, ctx.permissions.canFinalize),
        title: 'MANAGEMENT.STATUS.FINALIZATION',
    },
];

export function detailsTitle(ctx: DetailsContext): string {
    const rule = RULES.find((r) => r.when(ctx));
    return rule?.title ?? 'MANAGEMENT.STATUS.INFORMATION';
}
