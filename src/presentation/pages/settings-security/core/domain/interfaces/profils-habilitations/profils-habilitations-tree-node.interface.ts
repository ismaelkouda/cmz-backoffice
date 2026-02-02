import { TreeNode } from 'primeng/api';

export interface ProfilsHabilitationsTreeNodeInterface extends TreeNode {
    key: string;
    label: string;
    icon: string;
    checked: boolean;
    selectable: boolean;
    expanded: boolean;
    children: ProfilsHabilitationsTreeNodeInterface[];
}
