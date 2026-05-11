import { TreeNode } from 'primeng/api';

export interface PermissionTreeNodeApiDto extends TreeNode {
    value: string;
    title: string;
    slug?: string;
    actions: {
        read: false;
        write: false;
        run: false;
        export: false;
    };
    checked: boolean;
}
