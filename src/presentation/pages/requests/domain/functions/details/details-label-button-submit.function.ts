import { detailsPermissionsApprove } from '@pages/requests/domain/functions/details/details-permissions-approve.function';
import { detailsPermissionsReject } from '@pages/requests/domain/functions/details/details-permissions-reject.function';
import { detailsPermissionsTake } from '@pages/requests/domain/functions/details/details-permissions-take.function';

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
            detailsPermissionsApprove(ctx.props, ctx.permissions.canQualify) ||
            detailsPermissionsReject(ctx.props),
        title: 'MANAGEMENT.BUTTONS.APPROBATION',
    },
];

export function detailsLabelButtonSubmit(ctx: DetailsContext): string {
    const rule = RULES.find((r) => r.when(ctx));
    return rule?.title ?? 'MANAGEMENT.BUTTONS.INFORMATION';
}
