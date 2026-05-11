// import { detailsPermissionsApprove } from '@pages/report-states/domain/functions/details/details-permissions-approve.function';
// import { detailsPermissionsReject } from '@pages/report-states/domain/functions/details/details-permissions-reject.function';
// import { detailsPermissionsTake } from '@pages/report-states/domain/functions/details/details-permissions-take.function';

// import {
//     DetailsContext,
//     DetailsRule,
// } from '../../entities/details/details.entity';
// import { DetailsPermissions } from '../../types/details/details-permissions.type';

// const RULES: DetailsRule[] = [
//     {
//         name: 'TAKE',
//         when: (ctx) =>
//             detailsPermissionsTake(ctx.props, ctx.permissions.canTake),
//         title: 'take',
//     },
//     {
//         name: 'APPROVE',
//         when: (ctx) =>
//             detailsPermissionsApprove(ctx.props, ctx.permissions.canQualify) ||
//             detailsPermissionsReject(ctx.props),
//         title: 'approve',
//     },
// ];

// export function detailsPermissionsManage(
//     ctx: DetailsContext
// ): DetailsPermissions {
//     const rule = RULES.find((r) => r.when(ctx));
//     return rule?.title ?? 'see';
// }
