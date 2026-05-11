import { Injectable } from '@angular/core';
import { TreeNodeEntity } from '@presentation/pages/settings-security/domain/entities/profiles-permissions/profiles-permissions-tree-node.entity';
import { TreeNodeInterface } from '@presentation/pages/settings-security/infrastructure/api/dto/profiles-permissions/profiles-permissions-tree-node.interface';
import { PermissionAction } from '@shared/domain/types/permission-action.type';

@Injectable({
    providedIn: 'root',
})
export class PermissionTreeService {
    mapNodes(permissions: TreeNodeEntity[]): TreeNodeInterface[] {
        return permissions.map((node) => this.mapNode(node));
    }

    private mapNode(entity: TreeNodeEntity): TreeNodeInterface {
        const children = entity.children.map((child) => this.mapNode(child));

        return {
            key: entity.key,
            value: entity.value,
            label: entity.label,
            actions: { ...entity.actions },
            availableActions: [...entity.availableActions],
            selectable: true,
            expanded: this.hasCheckedDescendant(children),
            children,
            leaf: entity.isLeaf,
        };
    }

    private hasCheckedDescendant(children: TreeNodeInterface[]): boolean {
        return children.some(
            (child) =>
                this.hasAnyCheckedAction(child) ||
                this.hasCheckedDescendant(child.children ?? [])
        );
    }

    private hasAnyCheckedAction(node: TreeNodeInterface): boolean {
        return Object.values(node.actions ?? {}).some(Boolean);
    }

    expandAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: true,
            children: node.children ? this.expandAll(node.children) : [],
        }));
    }

    collapseAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        return nodes.map((node) => ({
            ...node,
            expanded: false,
            children: node.children ? this.collapseAll(node.children) : [],
        }));
    }

    updateNodeAction(
        node: TreeNodeInterface,
        action: string,
        checked: boolean
    ): void {
        if (!node.actions) {
            node.actions = {};
        }

        node.actions[action] = checked;

        this.propagateDown(node, action, checked);
        this.propagateUp(node, action);
    }

    private propagateDown(
        node: TreeNodeInterface,
        action: string,
        checked: boolean
    ): void {
        node.children?.forEach((child) => {
            if (child.availableActions?.includes(action)) {
                child.actions[action] = checked;
            }

            this.propagateDown(child, action, checked);
        });
    }

    private propagateUp(node: TreeNodeInterface, action: string): void {
        let parent = node.parent;

        while (parent) {
            const children = parent.children ?? [];

            const eligibleChildren = children.filter((child) =>
                child.availableActions?.includes(action)
            );

            if (!eligibleChildren.length) {
                parent = parent.parent;
                continue;
            }

            const allChecked = eligibleChildren.every(
                (child) => child.actions?.[action] === true
            );

            const noneChecked = eligibleChildren.every(
                (child) => !child.actions?.[action]
            );

            if (allChecked) {
                parent.actions[action] = true;
            } else if (noneChecked) {
                parent.actions[action] = false;
            } else {
                parent.actions[action] = false;
            }

            parent = parent.parent;
        }
    }

    getActionState(
        node: TreeNodeInterface,
        action: PermissionAction
    ): 'checked' | 'unchecked' | 'indeterminate' {
        const children = node.children ?? [];

        if (!children.length) {
            return node.actions?.[action] ? 'checked' : 'unchecked';
        }

        const eligibleChildren = children.filter((child) =>
            child.availableActions?.includes(action)
        );

        if (!eligibleChildren.length) {
            return node.actions?.[action] ? 'checked' : 'unchecked';
        }

        const checkedCount = eligibleChildren.filter(
            (child) => child.actions?.[action]
        ).length;

        if (checkedCount === 0) {
            return 'unchecked';
        }

        if (checkedCount === eligibleChildren.length) {
            return 'checked';
        }

        return 'indeterminate';
    }

    updateNodeSelection(node: TreeNodeInterface, checked: boolean): void {
        node.checked = checked;
        Object.keys(node.actions ?? {}).forEach((action) => {
            node.actions[action] = checked;
        });
        this.propagateNodeDown(node, checked);
        Object.keys(node.actions ?? {}).forEach((action) => {
            this.propagateUp(node, action);
        });
    }

    private propagateNodeDown(node: TreeNodeInterface, checked: boolean): void {
        node.children?.forEach((child) => {
            Object.keys(child.actions ?? {}).forEach((action) => {
                child.actions[action] = checked;
            });
            this.propagateNodeDown(child, checked);
        });
    }

    // private propagateNodeUp(node: TreeNodeInterface, action: string): void {
    //     console.log('node: ', node);
    //     let parent = node.parent;
    //     console.log('parent: ', parent);

    //     while (parent) {
    //         const children = parent.children ?? [];
    //         console.log('children: ', children);

    //         const eligibleChildren = children.filter((child) =>
    //             child.availableActions?.includes(action)
    //         );

    //         if (!eligibleChildren.length) {
    //             parent = parent.parent;
    //             continue;
    //         }
    //         console.log('eligibleChildren: ', eligibleChildren);

    //         parent.actions[action] = true;

    //         parent = parent.parent;
    //     }
    // }

    getNodeState(
        node: TreeNodeInterface
    ): 'checked' | 'unchecked' | 'indeterminate' {
        const actions = Object.values(node.actions ?? {});
        if (!actions.length) {
            return 'unchecked';
        }
        const allTrue = actions.every(Boolean);
        const allFalse = actions.every((v) => !v);
        if (allTrue) {
            return 'checked';
        }
        if (allFalse) {
            return 'unchecked';
        }
        return 'indeterminate';
    }

    flatten(nodes: TreeNodeInterface[]) {
        const result: Record<string, string[]> = {};

        const walk = (node: TreeNodeInterface): boolean => {
            const activeActions = Object.entries(node.actions ?? {})
                .filter(([, v]) => v)
                .map(([k]) => k);

            const hasChildren = !!node.children?.length;

            let hasActiveDescendant = false;

            if (node.children?.length) {
                hasActiveDescendant = node.children.map(walk).some(Boolean);
            }

            if (!hasChildren) {
                if (node.checked || activeActions.length > 0) {
                    result[node.key] = activeActions;
                    return true;
                }
                return false;
            }

            if (hasActiveDescendant) {
                result[node.key] = activeActions;
                return true;
            }

            return false;
        };

        nodes.forEach(walk);

        return result;
    }

    collectCheckedNodes(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        const result: TreeNodeInterface[] = [];

        const walk = (node: TreeNodeInterface) => {
            if (this.hasAnyCheckedAction(node)) {
                result.push(node);
            }

            node.children?.forEach(walk);
        };

        nodes.forEach(walk);

        return result;
    }
}
