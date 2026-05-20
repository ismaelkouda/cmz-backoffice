import { detailsPermissionsTake } from '@pages/processing/domain/functions/details/details-permissions-take.function';
import { detailsPermissionsTreat } from '@pages/processing/domain/functions/details/details-permissions-treat.function';

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
            detailsPermissionsTreat(ctx.props, ctx.permissions.canTreat),
        title: 'MANAGEMENT.BUTTONS.TREATMENT',
    },
];

export function detailsLabelButtonSubmit(ctx: DetailsContext): string {
    const rule = RULES.find((r) => r.when(ctx));
    return rule?.title ?? 'MANAGEMENT.BUTTONS.INFORMATION';
}
