import { TreeNode } from 'primeng/api';

export interface PermissionTreeNodeApiDto extends TreeNode {
    value: string;
    title: string;
    checked: boolean;
}
