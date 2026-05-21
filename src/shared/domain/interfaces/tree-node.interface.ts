import { TreeNode } from 'primeng/api';

export interface TreeNodeInterface extends TreeNode {
    key: string;
    value: string;
    label: string;
    icon: string;
    selectable: boolean;
    expanded: boolean;
    children: TreeNodeInterface[];
}
