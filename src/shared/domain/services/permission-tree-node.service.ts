import { Injectable } from '@angular/core';
import { TreeNodeInterface } from '@shared/domain/interfaces/tree-node.interface';

import { TreeNodeEntity } from '../entities/tree-node.entity';
import { PermissionAction } from '../types/permission-action.type';

@Injectable({ providedIn: 'root' })
export class PermissionTreeService {
    public mapNodes(permissions: TreeNodeEntity[]): TreeNodeInterface[] {
        return permissions.map((p: TreeNodeEntity) => this.mapNode(p));
    }

    private mapNode(entity: TreeNodeEntity): TreeNodeInterface {
        const children: TreeNodeInterface[] = (entity.children ?? []).map(
            (c: TreeNodeEntity) => this.mapNode(c)
        );

        const hasCheckedDescendant = children.some(
            (c) => c.checked || c.expanded
        );

        return {
            key: entity?.key.toString(),
            value: entity?.value.toString(),
            label: entity?.label,
            icon: entity?.label ?? '',
            actions: entity.actions,
            selectable: true,
            expanded: hasCheckedDescendant,
            children,
            leaf: children.length === 0,
        };
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

    propagateDown(
        node: TreeNodeInterface,
        action: PermissionAction,
        value: boolean
    ): void {
        node.data.actions[action] = value;

        node.children?.forEach((child) =>
            this.propagateDown(child, action, value)
        );
    }

    propagateUp(node: TreeNodeInterface, action: PermissionAction): void {
        let parent = node.parent;
        if (!parent) {
            return;
        }

        while (parent) {
            const children = parent.children ?? [];

            const allChecked = children.every(
                (child: any) => child.data?.actions?.[action] === true
            );

            parent.data.actions[action] = allChecked;

            parent = parent.parent;
        }
    }

    getActionState(
        node: TreeNodeInterface,
        action: PermissionAction
    ): 'checked' | 'unchecked' | 'indeterminate' {
        if (!node.children?.length && node.actions) {
            return node.actions[action] ? 'checked' : 'unchecked';
        }

        const states = node.children.map((c) => this.getActionState(c, action));

        const allChecked = states.every((s) => s === 'checked');
        const allUnchecked = states.every((s) => s === 'unchecked');

        if (allChecked) {
            return 'checked';
        }
        if (allUnchecked) {
            return 'unchecked';
        }

        return 'indeterminate';
    }

    flatten(nodes: TreeNodeInterface[]): any[] {
        const result = new Map<string, any>();

        const walk = (node: TreeNodeInterface) => {
            result.set(node.key, {
                key: node.key,
                actions: { ...node.actions },
            });

            node.children?.forEach(walk);
        };

        nodes.forEach(walk);

        return Array.from(result.values());
    }

    collectCheckedNodes(nodes: TreeNodeInterface[]): TreeNodeInterface[] {
        const result: TreeNodeInterface[] = [];

        const walk = (n: TreeNodeInterface) => {
            if (Object.values(n.actions ?? {}).some(Boolean)) {
                result.push(n);
            }

            n.children?.forEach(walk);
        };

        nodes.forEach(walk);

        return result;
    }
}
