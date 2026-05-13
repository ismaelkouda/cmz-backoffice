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

        const hasCheckedChildren = children.some(
            (child) => child.checked || child.partialChecked
        );

        return {
            key: entity.key,
            value: entity.value,
            label: entity.label,
            availableActions: [...entity.availableActions],
            actions: {
                ...entity.actions,
            },
            selectable: true,
            expanded: entity.checked || hasCheckedChildren,
            checked: entity.checked,
            partialChecked: !entity.checked && hasCheckedChildren,
            leaf: entity.isLeaf,
            children,
        };
    }

    private hasCheckedDescendant(children: TreeNodeInterface[]): boolean {
        return children.some((child) => {
            if (child.checked) {
                return true;
            }
            if (child.partialChecked) {
                return true;
            }
            if (this.hasAnyCheckedAction(child)) {
                return true;
            }
            return this.hasCheckedDescendant(child.children ?? []);
        });
    }

    private hasAnyCheckedAction(node: TreeNodeInterface): boolean {
        return Object.values(node.actions ?? {}).some(Boolean);
    }

    expandAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        nodes.forEach((node) => {
            node.expanded = true;

            if (node.children?.length) {
                this.expandAll(node.children);
            }
        });

        return [...nodes];
    }

    collapseAll(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        nodes.forEach((node) => {
            node.expanded = false;

            if (node.children?.length) {
                this.collapseAll(node.children);
            }
        });

        return [...nodes];
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
        this.refreshNodeState(node);
        this.propagateActionDown(node, action, checked);
        this.propagateNodeUp(node);
    }

    private propagateActionDown(
        node: TreeNodeInterface,
        action: string,
        checked: boolean
    ): void {
        node.children?.forEach((child) => {
            if (child.availableActions?.includes(action)) {
                child.actions[action] = checked;
            }
            this.refreshNodeState(child);
            this.propagateActionDown(child, action, checked);
        });
    }

    updateNodeSelection(node: TreeNodeInterface, checked: boolean): void {
        node.checked = checked;
        node.partialChecked = false;
        Object.keys(node.actions ?? {}).forEach((action) => {
            node.actions[action] = checked;
        });
        this.propagateNodeDown(node, checked);
        this.propagateNodeUp(node);
    }

    private propagateNodeDown(node: TreeNodeInterface, checked: boolean): void {
        node.children?.forEach((child) => {
            child.checked = checked;

            child.partialChecked = false;

            Object.keys(child.actions ?? {}).forEach((action) => {
                child.actions[action] = checked;
            });

            this.refreshNodeState(child);

            this.propagateNodeDown(child, checked);
        });
    }

    private refreshNodeState(node: TreeNodeInterface): void {
        const children = node.children ?? [];

        if (children.length) {
            const checkedChildren = children.filter(
                (child) => child.checked
            ).length;

            const hasPartialChild = children.some(
                (child) => child.partialChecked
            );

            if (checkedChildren === children.length && !hasPartialChild) {
                node.checked = true;
                node.partialChecked = false;
                return;
            }

            if (checkedChildren === 0 && !hasPartialChild) {
                const actions = Object.values(node.actions ?? {});

                if (!actions.length) {
                    node.checked = false;
                    node.partialChecked = false;
                    return;
                }

                const allChecked = actions.every(Boolean);

                const someChecked = actions.some(Boolean);

                node.checked = allChecked;

                node.partialChecked = someChecked && !allChecked;

                return;
            }

            node.checked = false;
            node.partialChecked = true;

            return;
        }

        const values = Object.values(node.actions ?? {});

        if (!values.length) {
            return;
        }

        const allChecked = values.every(Boolean);

        const noneChecked = values.every((v) => !v);

        if (allChecked) {
            node.checked = true;
            node.partialChecked = false;
            return;
        }

        if (noneChecked) {
            node.checked = false;
            node.partialChecked = false;
            return;
        }

        node.checked = false;
        node.partialChecked = true;
    }

    private propagateNodeUp(node: TreeNodeInterface): void {
        let parent = node.parent;

        while (parent) {
            const children = parent.children ?? [];
            const checkedChildren = children.filter(
                (child) => child.checked
            ).length;
            const hasIndeterminateChild = children.some(
                (child) => child.partialChecked
            );
            if (checkedChildren === children.length && !hasIndeterminateChild) {
                parent.checked = true;

                parent.partialChecked = false;
            } else if (checkedChildren === 0 && !hasIndeterminateChild) {
                parent.checked = false;
                parent.partialChecked = false;
            } else {
                parent.checked = false;
                parent.partialChecked = true;
            }
            this.refreshParentActions(parent);
            parent = parent.parent;
        }
    }

    private refreshParentActions(parent: TreeNodeInterface): void {
        const children = parent.children ?? [];
        const actions = parent.availableActions ?? [];

        actions.forEach((action) => {
            const eligibleChildren = children.filter((child) =>
                child.availableActions?.includes(action)
            );
            if (!eligibleChildren.length) {
                return;
            }
            const allChecked = eligibleChildren.every(
                (child) => child.actions?.[action] === true
            );
            // const someChecked = eligibleChildren.some(
            //     (child) => child.actions?.[action] === true
            // );
            // parent.actions[action] = allChecked || someChecked;
            if (allChecked) {
                parent.actions[action] = true;
            } else {
                parent.actions[action] = false;
            }
        });
    }

    recalculateTreeState(nodes: TreeNodeInterface[]): void {
        nodes.forEach((node) => {
            this.recalculateNode(node);
        });
    }

    private recalculateNode(node: TreeNodeInterface): void {
        node.children?.forEach((child) => {
            this.recalculateNode(child);
        });

        this.refreshNodeState(node);

        if (node.checked || node.partialChecked) {
            this.expandParents(node);
        }
    }

    private expandParents(node: TreeNodeInterface): void {
        let parent = node.parent;

        while (parent) {
            parent.expanded = true;
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
        const hasPartial = eligibleChildren.some(
            (child) => child.partialChecked
        );

        if (hasPartial) {
            return 'indeterminate';
        }
        return 'indeterminate';
    }

    getNodeState(
        node: TreeNodeInterface
    ): 'checked' | 'unchecked' | 'indeterminate' {
        if (node.partialChecked) {
            return 'indeterminate';
        }
        return node.checked ? 'checked' : 'unchecked';
    }

    flatten(nodes: TreeNodeInterface[]): Record<string, string[]> {
        const result: Record<string, string[]> = {};
        const walk = (node: TreeNodeInterface): boolean => {
            const activeActions = Object.entries(node.actions ?? {})
                .filter(([, value]) => value)
                .map(([action]) => action);
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
            if (
                hasActiveDescendant ||
                node.checked ||
                activeActions.length > 0
            ) {
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
            if (
                node.checked ||
                node.partialChecked ||
                this.hasAnyCheckedAction(node)
            ) {
                result.push(node);
            }
            node.children?.forEach(walk);
        };
        nodes.forEach(walk);
        return result;
    }
}
