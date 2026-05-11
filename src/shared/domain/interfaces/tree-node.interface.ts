import { IProfilesPermissionActions } from '@presentation/pages/settings-security/presentation/adapters/profiles-permissions/profiles-permissions-actions.interface';
import { TreeNode } from 'primeng/api';

export interface TreeNodeInterface extends TreeNode {
    key: string;
    value: string;
    label: string;
    icon: string;

    actions?: IProfilesPermissionActions;

    selectable: boolean;
    expanded: boolean;
    children: TreeNodeInterface[];
}
