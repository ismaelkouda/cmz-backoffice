// import { TreeNodeInterface } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-tree-node.interface';
// import { TreeNode } from 'primeng/api';

// export class ProfilesPermissionsFindOnePresenter {
//     mapToTreeTable(nodes: TreeNodeInterface[]): TreeNode[] {
//         return nodes.map((node) => ({
//             key: node.key,
//             leaf: node.leaf,
//             expanded: node.expanded,
//             selectable: node.selectable,

//             data: {
//                 label: node.label,
//                 value: node.value,

//                 actions: node.actions,
//             },

//             children: node.children?.length
//                 ? this.mapToTreeTable(node.children)
//                 : [],
//         }));
//     }
// }
