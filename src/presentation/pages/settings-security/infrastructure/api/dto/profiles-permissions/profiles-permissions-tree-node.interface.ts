import { PermissionActionsMap } from './permission-actions-map.interface';

export interface TreeNodeInterface {
    key: string;
    value: string;
    label: string;

    availableActions: string[];
    actions: PermissionActionsMap;

    expanded?: boolean;
    selectable?: boolean;
    leaf?: boolean;
    checked?: boolean;

    parent?: TreeNodeInterface;
    children?: TreeNodeInterface[];
}
